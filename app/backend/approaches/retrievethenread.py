from typing import Any, AsyncGenerator, Optional, Union

from azure.search.documents.aio import SearchClient
from azure.search.documents.models import VectorQuery
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam
from openai_messages_token_helper import build_messages, get_token_limit

from approaches.approach import Approach, ThoughtStep
from core.authentication import AuthenticationHelper


class RetrieveThenReadApproach(Approach):
    """
    Simple retrieve-then-read implementation, using the AI Search and OpenAI APIs directly. It first retrieves
    top documents from search, then constructs a prompt with them, and then uses OpenAI to generate an completion
    (answer) with that prompt.
    """

    system_chat_template = """You are an expert dental market analyst working for Dental Market Insights (DMI), a company offering high-quality and specialized market research and intelligence services to dental organizations. At DMI, we have collected all the updates regarding the dental market from 2023. You have access to comprehensive insights and news about market trends, reports, and updates from dental companies regarding new product releases, financial performance, and more.
Your role is to assist dental industry professionals in finding relevant insights and information according to their questions. Always answer questions based on the provided information and try to use as many different sources as possible. Your answers should have a professional and objective tone. Use 'you' to refer to the individual asking the questions, even if they ask using 'I'.
Answer the following questions using only the data provided in the sources below. For tabular information, return it as an HTML table. Do not use markdown format. Each source has a name followed by the actual information; always include the source name for each fact you use in the response. If you cannot answer using the sources below, state that you don't know.
"""

    # shots/sample conversation
    question = """
'What is the deductible for the employee plan for a visit to Overlake in Bellevue?'

Sources:
info1.txt: deductibles depend on whether you are in-network or out-of-network. In-network deductibles are $500 for employee and $1000 for family. Out-of-network deductibles are $1000 for employee and $2000 for family.
info2.pdf: Overlake is in-network for the employee plan.
info3.pdf: Overlake is the name of the area that includes a park and ride near Bellevue.
info4.pdf: In-network institutions include Overlake, Swedish and others in the region
"""
    answer = "In-network deductibles are $500 for employee and $1000 for family [info1.txt] and Overlake is in-network for the employee plan [info2.pdf][info4.pdf]."

    def __init__(
        self,
        *,
        search_client: SearchClient,
        auth_helper: AuthenticationHelper,
        openai_client: AsyncOpenAI,
        chatgpt_model: str,
        chatgpt_deployment: Optional[str],  # Not needed for non-Azure OpenAI
        embedding_model: str,
        # Not needed for non-Azure OpenAI or for retrieval_mode="text"
        embedding_deployment: Optional[str],
        embedding_dimensions: int,
        sourcepage_field: str,
        content_field: str,
        query_language: str,
        query_speller: str,
    ):
        self.search_client = search_client
        self.chatgpt_deployment = chatgpt_deployment
        self.openai_client = openai_client
        self.auth_helper = auth_helper
        self.chatgpt_model = chatgpt_model
        self.embedding_model = embedding_model
        self.embedding_dimensions = embedding_dimensions
        self.chatgpt_deployment = chatgpt_deployment
        self.embedding_deployment = embedding_deployment
        self.sourcepage_field = sourcepage_field
        self.content_field = content_field
        self.query_language = query_language
        self.query_speller = query_speller
        self.chatgpt_token_limit = get_token_limit(chatgpt_model)

    async def run(
        self,
        messages: list[ChatCompletionMessageParam],
        stream: bool = False,  # Stream is not used in this approach
        session_state: Any = None,
        context: dict[str, Any] = {},
    ) -> Union[dict[str, Any], AsyncGenerator[dict[str, Any], None]]:
        q = messages[-1]["content"]
        if not isinstance(q, str):
            raise ValueError(
                "The most recent message content must be a string.")
        overrides = context.get("overrides", {})
        auth_claims = context.get("auth_claims", {})
        has_text = overrides.get("retrieval_mode") in ["text", "hybrid", None]
        has_vector = overrides.get("retrieval_mode") in [
            "vectors", "hybrid", None]
        use_semantic_ranker = overrides.get("semantic_ranker") and has_text

        use_semantic_captions = True if overrides.get(
            "semantic_captions") and has_text else False
        top = overrides.get("top", 3)
        minimum_search_score = overrides.get("minimum_search_score", 0.0)
        minimum_reranker_score = overrides.get("minimum_reranker_score", 0.0)
        filter = self.build_filter(overrides, auth_claims)
        # If retrieval mode includes vectors, compute an embedding for the query
        vectors: list[VectorQuery] = []
        if has_vector:
            vectors.append(await self.compute_text_embedding(q))

        # Only keep the text query if the retrieval mode uses text, otherwise drop it
        query_text = q if has_text else None

        results = await self.search(
            top,
            query_text,
            filter,
            vectors,
            use_semantic_ranker,
            use_semantic_captions,
            minimum_search_score,
            minimum_reranker_score,
        )

        # Process results
        sources_content = self.get_sources_content(
            results, use_semantic_captions, use_image_citation=False)

        # Append user message
        content = "\n".join(sources_content)
        user_content = q + "\n" + f"Sources:\n {content}"

        response_token_limit = 1024
        updated_messages = build_messages(
            model=self.chatgpt_model,
            system_prompt=overrides.get(
                "prompt_template", self.system_chat_template),
            few_shots=[{"role": "user", "content": self.question},
                       {"role": "assistant", "content": self.answer}],
            new_user_content=user_content,
            max_tokens=self.chatgpt_token_limit - response_token_limit,
        )

        chat_completion = (
            await self.openai_client.chat.completions.create(
                # Azure OpenAI takes the deployment name as the model name
                model=self.chatgpt_deployment if self.chatgpt_deployment else self.chatgpt_model,
                messages=updated_messages,
                temperature=overrides.get("temperature", 0.3),
                max_tokens=response_token_limit,
                n=1,
            )
        ).model_dump()

        data_points = {"text": sources_content}
        extra_info = {
            "data_points": data_points,
            "thoughts": [
                ThoughtStep(
                    "Search using user query",
                    query_text,
                    {
                        "use_semantic_captions": use_semantic_captions,
                        "use_semantic_ranker": use_semantic_ranker,
                        "top": top,
                        "filter": filter,
                        "has_vector": has_vector,
                    },
                ),
                ThoughtStep(
                    "Search results",
                    [result.serialize_for_results() for result in results],
                ),
                ThoughtStep(
                    "Prompt to generate answer",
                    [str(message) for message in updated_messages],
                    (
                        {"model": self.chatgpt_model,
                            "deployment": self.chatgpt_deployment}
                        if self.chatgpt_deployment
                        else {"model": self.chatgpt_model}
                    ),
                ),
            ],
        }

        chat_completion["choices"][0]["context"] = extra_info
        chat_completion["choices"][0]["session_state"] = session_state
        return chat_completion

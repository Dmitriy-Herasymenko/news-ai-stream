import { generateCommentsCohereChat } from "../../../lib/generateComments";

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description } = body;

  const comments = await generateCommentsCohereChat(title, description || "");
  return Response.json(comments);
}

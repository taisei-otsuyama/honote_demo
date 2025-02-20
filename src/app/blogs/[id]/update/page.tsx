import { auth } from "@/auth";
import UpdateForm from "../../../../components/updateForm";

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const session = await auth();
  if (!session) {
    return <div>ログインしてください。</div>;
  }

  const { id } = params;

  return (
    <div>
      <UpdateForm target_id={id} />
    </div>
  );
}

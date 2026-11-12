import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Markdown } from "@/components/markdown";
import { LabRunner } from "@/components/lab-runner";
import { Card, CardBody, PageHeader } from "@/components/ui";
import { parseJson } from "@/lib/utils";

export const metadata = { title: "Laboratório" };

export default async function LabExercisePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await requireUser();
  const ex = await db.labExercise.findUnique({ where: { slug }, include: { topic: true, specialty: true } });
  if (!ex) notFound();
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-2 text-xs text-muted">
        <Link href="/laboratorio" className="hover:text-accent">Laboratório</Link> › {ex.specialty.shortName}
        {ex.topic && <> › <Link href={`/assuntos/${ex.topic.id}`} className="hover:text-accent">{ex.topic.title}</Link></>}
      </div>
      <PageHeader title={ex.title} />
      <Card className="mb-4">
        <CardBody>
          <Markdown>{ex.prompt}</Markdown>
        </CardBody>
      </Card>
      <LabRunner exerciseId={ex.id} kind={ex.kind} payload={parseJson(ex.payload, {})} solution={ex.solution} />
    </div>
  );
}

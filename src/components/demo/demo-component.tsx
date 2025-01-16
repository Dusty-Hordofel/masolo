import { cn } from "@/lib/utils";
import { readComponentSource } from "./read-component-source";
import CopyButton from "./copy-button";
import InputDemo1 from "@/components/inputs/input-01";

export default async function DemoComponent({
  directory,
  componentName,
  className,
}: {
  directory: string;
  componentName: string;
  className?: string;
}) {
  const Component = (await import(`@/components/${directory}/${componentName}`))
    .default;
  const source = await readComponentSource(directory, componentName);
  console.log("🚀 ~ source:", source);

  return (
    <div className={cn("group/item relative", className)}>
      <Component />
      <CopyButton componentSource={source || ""} />
    </div>
  );
}

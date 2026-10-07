import { type ProjectItem } from "./portfolioData";
import { LaptopMockup } from "./LaptopMockup";

interface ProjectPreviewProps {
  project: ProjectItem;
  className?: string;
}

/**
 * Project preview presented inside an ultra-realistic MacBook laptop mockup.
 */
export function ProjectPreview({ project, className = "" }: ProjectPreviewProps) {
  return (
    <div className={`project-preview-wrapper group/preview relative w-full ${className}`}>
      <LaptopMockup project={project} openProgress={1} lidAngle={0} />
    </div>
  );
}

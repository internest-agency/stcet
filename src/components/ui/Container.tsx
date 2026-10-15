interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const baseClassName = "mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl xl:max-w-[1560]";

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={baseClassName + (className ? " " + className : "")}>
      {children}
    </div>
  );
}

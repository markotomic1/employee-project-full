import "./wrapper.scss";

const Wrapper = (props: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={`${
        props.className !== undefined ? props.className : "wrapper"
      }`}
    >
      {props.children}
    </div>
  );
};

export default Wrapper;

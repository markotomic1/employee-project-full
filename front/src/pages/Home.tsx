import {
  Await,
  defer,
  redirect,
  useLoaderData,
  useRevalidator,
} from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import Modal from "../components/Modal/Modal";
import Wrapper from "../UI/Wrapper/Wrapper";
import LeavesDisplayContainer from "../components/LeavesDisplayContainer/LeavesDisplayContainer";
import { axiosInstance } from "../utils/axiosRequest";

export type ModalType =
  | "leaveForm"
  | "changePasswordForm"
  | "changeStateForm"
  | "reportForm"
  | "closed";

const Home = () => {
  const [showModal, setShowModal] = useState<ModalType>("closed");
  const { res } = useLoaderData() as { res: { data: [] } };
  const revalidator = useRevalidator();
  useEffect(() => {
    revalidator.revalidate();
  }, []);
  return (
    <Wrapper className='home-wrapper'>
      {showModal !== "closed" && (
        <Modal setShowModal={setShowModal} showModal={showModal} />
      )}
      <Suspense fallback='Loading...'>
        <Await resolve={res}>
          {({ data }) => {
            return (
              <LeavesDisplayContainer
                leaves={data}
                setShowModal={setShowModal}
              />
            );
          }}
        </Await>
      </Suspense>
    </Wrapper>
  );
};
export const loader = ({ request }: { request: { url: string } }) => {
  const query = new URL(request.url).searchParams;
  const allLeaves = query.get("allLeaves");
  const state = query.get("state");
  const loadLeaves = async () => {
    if (allLeaves) {
      return axiosInstance.get(
        `/apply/listAll${state ? `?state=${state}` : ""}`
      );
    }
    return axiosInstance.get("/apply/");
  };
  if (localStorage.getItem("token")) {
    return defer({ res: loadLeaves() });
  }
  return redirect("/login");
};

export default Home;

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosWrapper } from "../../redux/api/axiosWrapper";

const AcceptInvitation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const processInvitation = async () => {
      try {
        const response = await axiosWrapper.get(
          "/api/v1/collaborators/accept",
          {
            params: { token },
          },
        );
        if (response) {
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } catch (error) {}
    };

    processInvitation();
  }, [token, navigate, t]);

  return <div></div>;
};

export default AcceptInvitation;

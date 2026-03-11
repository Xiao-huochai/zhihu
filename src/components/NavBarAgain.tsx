import { NavBar } from "antd-mobile";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
type navBarAgain = {
  title: string;
};

export default function NavBarAgain(props: navBarAgain) {
  let { title = "默认标题" } = props;
  const navigate = useNavigate(),
    location = useLocation(),
    [usp] = useSearchParams();
  const handleBack = () => {
    let to = usp.get("to");
    if (!to) navigate(-1);
    else if (location.pathname === `/login` && /^\detail\/\d+$/.test(to)) {
      navigate(to, { replace: true });
    }
    navigate(-1);
  };

  return (
    <NavBar className="navbar-again-box" onBack={handleBack}>
      {title}
    </NavBar>
  );
}

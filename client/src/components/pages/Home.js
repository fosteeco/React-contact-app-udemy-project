import React, { useContext, useEffect } from "react";
import Contacts from "../contacts/Contacts";
import ContactForm from "../contacts/ContactForm";
import ContactFilter from "../contacts/ContactFilter";
import AuthContext from "../../context/auth/authContext"; /* Adding this to keep user logged in on page refreshes  */

export const Home = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    authContext.loadUser(); /* Will look at the token, hit the backend validate it and put the user into state   */
    // eslint-disable-next-line
  }, []);

  return (
    <div className="grid-2">
      <div>
        <ContactForm />
      </div>
      <div>
        <ContactFilter />
        <Contacts />
      </div>
    </div>
  );
};
export default Home;

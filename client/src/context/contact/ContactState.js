import React, { useReducer } from "react";
import uuid from "uuid"; /* Used to generate a random id  */
import ContactContext from "./contactContext";
import contactReducer from "./contactReducer";
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER,
} from "../types";

/* Create initial state */
const ContactState = (props) => {
  const initialState = {
    /* Using hardcoded data for now  */
    contacts: [
      {
        id: 1,
        name: "Gibby Cilon",
        email: "Giby@gmail.com",
        phone: "111-111-1111",
      },
      {
        id: 2,
        name: "Yolo Yeezy",
        email: "YeezyY@gmail.com",
        phone: "222-222-2222",
      },
      {
        id: 3,
        name: "Harley Shay",
        email: "Harleys@gmail.com",
        phone: "333-333-3333",
      },
    ],
  };
  const [state, dispatch] = useReducer(contactReducer, initialState);

  // Add contact

  // Delete contact

  // Set current contact

  // Clear current contact

  // Update contact  /* Full CRUD  */

  // Filter contacts

  // Clear filter

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;

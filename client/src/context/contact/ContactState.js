import React, { useReducer } from "react";
import axios from "axios";
import ContactContext from "./contactContext";
import contactReducer from "./contactReducer";
import {
  GET_CONTACTS,
  CLEAR_CONTACTS,
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER,
  CONTACT_ERROR,
} from "../types";

/* Create initial state */
const ContactState = (props) => {
  const initialState = {
    contacts: null,
    /* Want to put the contact to edit in this parameter */
    current: null,
    filtered: null,
    error: null,
  };
  const [state, dispatch] = useReducer(contactReducer, initialState);

  // Get Contacts
  const getContacts = async () => {
    try {
      const res = await axios.get("api/contacts");
      dispatch({ type: GET_CONTACTS, payload: res.data });
    } catch (error) {
      dispatch({ type: CONTACT_ERROR, payload: error.response.msg });
    }
  };

  // Add contact
  const addContact = async (contact) => {
    /* Not using mongodb yet so we use uuid  */
    // contact.id = uuidv4();
    const config = {
      /* Don't have to worry about sending token because it is set globally with the /utils/setAuthToken.js */
      headers: { "Content-Type": "application/json" },
    };
    try {
      const res = await axios.post("api/contacts", contact, config);
      dispatch({ type: ADD_CONTACT, payload: res.data });
    } catch (error) {
      dispatch({ type: CONTACT_ERROR, payload: error.response.msg });
    }
  };

  // Delete contact
  const deleteContact = async (id) => {
    try {
      await axios.delete(`api/contacts/${id}`);
      dispatch({ type: DELETE_CONTACT, payload: id });
    } catch (error) {
      dispatch({ type: CONTACT_ERROR, payload: error.response.msg });
    }
  };
  // Update contact  /* Full CRUD  */
  const updateContact = async (contact) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { _id } = contact;
    try {
      const res = await axios.put(`api/contacts/${_id}`, contact, config);
      dispatch({ type: UPDATE_CONTACT, payload: res.data });
    } catch (error) {
      dispatch({ type: CONTACT_ERROR, payload: error.response.msg });
    }
  };

  // Clear Contacts
  const clearContacts = () => {
    dispatch({ type: CLEAR_CONTACTS });
  };

  // Set current contact
  const setCurrent = (contact) => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  // Clear current contact
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Filter contacts
  const filterContacts = (text) => {
    dispatch({ type: FILTER_CONTACTS, payload: text });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addContact,
        deleteContact,
        setCurrent,
        filterContacts,
        clearFilter,
        clearCurrent,
        updateContact,
        getContacts,
        clearContacts,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;

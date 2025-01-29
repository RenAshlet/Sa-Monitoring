"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
ReusableModal

const Create = () => {
  const [showCreateSaModal, setShowCreateSaModal] = useState(false);
  const [alertShow, setAlertShow] = useState({
    show: false,
    variant: "success",
    message: "",
  });

  const handleCloseModal = () => setShowCreateSaModal(false);
  const handleShowModal = () => setShowCreateSaModal(true);

  const showAlert = (variant, message) => {
    setAlertShow({ show: true, variant, message });
    setTimeout(() => {
      setAlertShow((prev) => ({ ...prev, show: false }));
    }, 900);
  };

  return (
    <div>
      {/* Button to trigger the modal */}
      <Button variant="primary" className="mb-3" onClick={handleShowModal}>
        Create
      </Button>

      {/* Table to display data */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{/* Map through the list of SA and display them */}</tbody>
      </Table>

      {/* Reusable Modal for alerts */}
      <ReusableModal
        showModal={alertShow.show}
        handleCloseModal={() => setAlertShow({ ...alertShow, show: false })}
        title="Alert"
        bodyContent={<h5>{alertShow.message}</h5>}
        footerContent={
          <Button
            variant="secondary"
            onClick={() => setAlertShow({ ...alertShow, show: false })}
          >
            Close
          </Button>
        }
      />

      {/* Reusable Create SA Modal */}
      <ReusableModal
        showModal={showCreateSaModal}
        handleCloseModal={handleCloseModal}
        title="Create New Student Assistant"
        bodyContent={<div>Your form content goes here</div>} // Replace with your modal content
        footerContent={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleCloseModal();
              }}
            >
              Submit
            </Button>
          </>
        }
      />
    </div>
  );
};

export default Create;

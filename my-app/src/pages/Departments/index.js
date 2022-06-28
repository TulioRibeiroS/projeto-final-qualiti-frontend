import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import Page from "../../components/Page";
import ListView from "../../components/ListView";
import Modal from "../../components/Modal";
import api from "../../services/axios";

const endpoint = "/departments";

const columns = [
  {
    value: "ID",
    id: "id",
  },
  {
    value: "Name",
    id: "name",
  },
];

const INITIAL_STATE = { id: 0, name: "" };

const Departments = () => {
  const [visible, setVisible] = useState(false);
  const [departments, setDepartments] = useState({ INITIAL_STATE });

  const handleSave = async (refetch) => {
    try {
      if (departments.id) {
        await api.put(`${endpoint}/${departments.id}`, { name: departments.name });

        toast.success("Successfully update!");
      } else {
        await api.post(endpoint, { name: departments.name });

        toast.success("Successfully created!");
      }
      setVisible(false);

      await refetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClose = () => setVisible(false);

  const actions = [
    {
      name: "Edit",
      action: (_departments) => {
        setDepartments(_departments);
        setVisible(true);
      },
    },
    {
      name: "Remove",
      action: async (departments, refetch) => {
        if (window.confirm("Are you sure about that?")) {
          try {
            await api.delete(`${endpoint}/${departments.id}`);
            await refetch();
            toast.info(`Departments ${departments.name} was removed`);
          } catch (error) {
            toast.info(error.message);
          }
        }
      },
    },
  ];

  return (
    <Page title="Departments">
      <Button
        className="mb-2"
        onClick={() => {
          setDepartments(INITIAL_STATE);
          setVisible(true);
        }}
      >
        Create Departments
      </Button>

      <ListView actions={actions} columns={columns} endpoint={endpoint}>
        {({ refetch }) => (
          <Modal
            title={`${departments.id ? "Update" : "Create"} Departments`}
            show={visible}
            handleSave={() => handleSave(refetch)}
            handleClose={() => handleClose()}
          >
            <Form>
              <Form.Group>
                <Form.Label>Departments Name</Form.Label>
                <Form.Control
                  name="Departments"
                  onChange={(event) =>
                    setDepartments({ ...departments, name: event.target.value })
                  }
                  value={departments.name}
                />
              </Form.Group>
            </Form>
          </Modal>
        )}
      </ListView>
    </Page>
  );
};

export default Departments;

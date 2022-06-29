import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import Page from "../../components/Page";
import ListView from "../../components/ListView";
import Modal from "../../components/Modal";
import api from "../../services/axios";

const endpoint = "/professors";

const columns = [
  {
    value: "ID",
    id: "id",
  },
  {
    value: "Name",
    id: "name",
  },
  {
    value: "CPF",
    id: "cpf",
  },
  {
    value: "Department",
    id: "departmentId",
    // render: (departments) => departments.name,
  },
];

const INITIAL_STATE = { id: 0, name: "", cpf: "", department: 0 };

const Professors = () => {
  const [visible, setVisible] = useState(false);
  const [professor, setProfessor] = useState({ INITIAL_STATE });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    api
      .get("/departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const handleSave = async (refetch) => {
    const data = {
      name: professor.name,
      cpf: professor.cpf,
      departmentId: professor.departmentId,
    };

    try {
      if (professor.id) {
        await api.put(`${endpoint}/${professor.id}`, data);

        toast.success("Successfully updated!");
      } else {
        await api.post(endpoint, data);

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
      action: ({ id, name, cpf, department: { id: departmentId } }) => {
        setProfessor({ id, name, cpf, department: { id: departmentId } });
        setVisible(true);
      },
    },
    {
      name: "Remove",
      action: async (professor, refetch) => {
        if (window.confirm("Are you sure about that?")) {
          try {
            await api.delete(`${endpoint}/${professor.id}`);
            await refetch();
            toast.info(`Professor ${professor.name} was removed`);
          } catch (error) {
            toast.info(error.message);
          }
        }
      },
    },
  ];

  const onChange = ({ target: { name, value } }) => {
    setProfessor({
      ...professor,
      [name]: value,
    });
  };

  return (
    <Page title="Professors">
      <Button
        className="mb-2"
        onClick={() => {
          setProfessor(INITIAL_STATE);
          setVisible(true);
        }}
      >
        Create Professor
      </Button>

      <ListView actions={actions} columns={columns} endpoint={endpoint}>
        {({ refetch }) => (
          <Modal
            title={`${professor.id ? "Update" : "Create"} Professor`}
            show={visible}
            handleSave={() => handleSave(refetch)}
            handleClose={() => handleClose(false)}
          >
            <Form>
              <Form.Group>
                <Form.Label>Professor Name</Form.Label>
                <Form.Control
                  name="name"
                  onChange={onChange}
                  value={professor.name}
                />
                <Form.Label>Professor CPF</Form.Label>
                <Form.Control
                  name="cpf"
                  onChange={onChange}
                  value={professor.cpf}
                />
                <Form.Label>Department</Form.Label>
                <select
                  className="form-control"
                  name="departmentId"
                  onChange={onChange}
                  value={professor.departmentId}
                >
                    <option>Select one department</option>
                    {departments.map((item, index) => {
                        return ( 
                        <option key={index} value={item.id}>
                            {item.name}
                        </option>);
                    })}
                </select>
              </Form.Group>
            </Form>
          </Modal>
        )}
      </ListView>
    </Page>
  );
};

export default Professors;

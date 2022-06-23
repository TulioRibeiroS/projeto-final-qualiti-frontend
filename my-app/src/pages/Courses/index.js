import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import Page from "../../components/Page";
import ListView from "../../components/ListView";
import api from "../../services/axios";

const endpoint = "/courses";

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

const Courses = () => {
  const [visible, setVisible] = useState(false);
  const [course, setCourse] = useState({ INITIAL_STATE });

  const actions = [
    {
      name: "Edit",
      action: (_course) => {
        setCourse(_course);
        setVisible(true);
      },
    },
    {
      name: "Remove",
      action: async (item, refetch) => {
        if (window.confirm("Voce tem certeza disso?")) {
          try {
            await api.delete(`${endpoint}/${course.id}`);
            await refetch();
            toast.info(`Curso ${course.name} foi removido`);
          } catch (error) {
            toast.info(error.message);
          }
        }
      },
    },
  ];

  return (
    <Page title="Courses">
      <Button
        className="mb-2"
        onClick={() => {
          setCourse(INITIAL_STATE);
          setVisible(true);
        }}
      >
        Create Course
      </Button>

      <ListView
        actions={actions}
        columns={columns}
        endpoint={endpoint}
      ></ListView>
    </Page>
  );
};

export default Courses;

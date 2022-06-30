import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import Page from "../../components/Page";
import ListView from "../../components/ListView";
import Modal from "../../components/Modal";
import api from "../../services/axios";

const endpoint = "/allocations";

const columns = [
  {
    value: "ID",
    id: "id",
  },
  {
    value: "dayOfWeek",
    id: "dayOfWeek",
  },
  {
    value: "endHour",
    id: "endHour",
  },
  {
    value: "startHour",
    id: "startHour",
  },
  {
    value: "Professor",
    id: "professor",
    render: (professor) => professor.name,
  },
  {
    value: "Department",
    id: "professor",
    render: (professor) => professor?.department?.name,
  },
  {
    value: "Course",
    id: "course",
    render: (course) => course?.name,
  },
];

const INITIAL_STATE = {
  id: 0,
  dayOfWeek: "",
  endHour: "",
  startHour: "",
  professor: "",
  department: "",
  course: "",
};

const Allocations = () => {
  const [visible, setVisible] = useState(false);
  const [allocation, setAllocation] = useState({ INITIAL_STATE });
  const [professors, setProfessors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api
      .get("/professors")
      .then((response) => {
        setProfessors(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

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

  useEffect(() => {
    api
      .get("/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const handleSave = async (refetch) => {
    const data = {
      dayOfWeek: allocation.dayOfWeek,
      endHour: allocation.endHour,
      startHour: allocation.startHour,
      professorId: allocation.professorId,
      departmentId: allocation.departmentId,
      courseId: allocation.courseId,
    };

    try {
      if (allocation.id) {
        await api.put(`${endpoint}/${allocation.id}`, data);

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
      action: ({
        id,
        dayOfWeek,
        endHour,
        startHour,
        professor: { id: professorId },
        department: { id: departmentId },
        course: { id: courseId },
      }) => {
        setAllocation({
          id,
          dayOfWeek,
          endHour,
          startHour,
          professor: { id: professorId },
          department: { id: departmentId },
          course: { id: courseId },
        });
        setVisible(true);
      },
    },
    {
      name: "Remove",
      action: async (allocation, refetch) => {
        if (window.confirm("Are you sure about that?")) {
          try {
            await api.delete(`${endpoint}/${allocation.id}`);
            await refetch();
            toast.info(`Allocation ${allocation.id} was removed`);
          } catch (error) {
            toast.info(error.message);
          }
        }
      },
    },
  ];

  const onChange = ({ target: { name, value } }) => {
    setAllocation({
      ...allocation,
      [name]: value,
    });
  };

  return (
    <Page title={Allocations}>
      <Button
        className="mb-2"
        onClick={() => {
          setAllocation(INITIAL_STATE);
          setVisible(true);
        }}
      >
        Create Allocation
      </Button>

      <ListView actions={actions} columns={columns} endpoint={endpoint}>
        {({ refetch }) => (
          <Modal
            title={`${allocation.id ? "Update" : "Create"} Allocation`}
            show={visible}
            handleSave={() => handleSave(refetch)}
            handleClose={() => handleClose(false)}
          >
            <Form>
              <Form.Group>
                <Form.Label>dayOfWeek</Form.Label>
                <Form.Control
                  name="dayOfWeek"
                  onChange={onChange}
                  value={allocation.dayOfWeek}
                />
                <Form.Label>startHour</Form.Label>
                <Form.Control
                  name="startHour"
                  onChange={onChange}
                  value={allocation.startHour}
                />
                <Form.Label>endHour</Form.Label>
                <Form.Control
                  name="endHour"
                  onChange={onChange}
                  value={allocation.endHour}
                />
                <Form.Label>Professor</Form.Label>
                <select
                  className="form-control"
                  name="professorId"
                  onChange={onChange}
                  value={allocation.professorId}
                >
                  <option>Select one professor</option>
                  {professors.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                <Form.Label>Department</Form.Label>
                <select
                  className="form-control"
                  name="departmentId"
                  onChange={onChange}
                  value={allocation.departmentId}
                >
                  <option>Select one department</option>
                  {departments.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                <Form.Label>Course</Form.Label>
                <select
                  className="form-control"
                  name="courseId"
                  onChange={onChange}
                  value={allocation.courseId}
                >
                  <option>Select one course</option>
                  {courses.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    );
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

export default Allocations;

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    syllabus: "",
  });
  const [newUser, setNewUser] = useState({ name: "", role: "" });
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(localStorage.getItem("token"))
      const courseRes = await axios.get(
        "http://localhost:5000/api/admin/courses",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const userRes = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCourses(courseRes.data);
      setUsers(userRes.data);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/courses",
        newCourse,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCourses([...courses, res.data]);
      setNewCourse({ title: "", description: "", syllabus: "" });
    } catch (error) {
      console.error("Error creating course", error);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/courses/${courseId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course", error);
    }
  };

  const editCourse = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/courses/${editingCourse.id}`,
        editingCourse,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCourses(
        courses.map((course) => (course.id === res.data.id ? res.data : course))
      );
      setEditingCourse(null);
    } catch (error) {
      console.error("Error editing course", error);
    }
  };

  const createUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/users",
        newUser,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers([...users, res.data]);
      setNewUser({ name: "", role: "" });
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const editUser = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/users/${editingUser.id}`,
        editingUser,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(
        users.map((user) => (user.id === res.data.id ? res.data : user))
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Error editing user", error);
    }
  };

  const currentCourses = courses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const currentUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <h2 className="text-4xl font-black text-sky-600">Admin Dashboard</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="metrics">
        <div>
          <h3>Active Users</h3>
          <p>{users.length}</p>
        </div>
        <div>
          <h3>Available Courses</h3>
          <p>{courses.length}</p>
        </div>
      </div>

      <div className="crud-interfaces">
        <h3>Manage Courses</h3>
        <ul>
          {currentCourses.map((course) => (
            <li key={course.id}>
              {course.title}
              <button onClick={() => setEditingCourse(course)}>Edit</button>
              <button onClick={() => deleteCourse(course.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <h3>Add New Course</h3>
        <input
          type="text"
          placeholder="Title"
          value={newCourse.title}
          onChange={(e) =>
            setNewCourse({ ...newCourse, title: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description"
          value={newCourse.description}
          onChange={(e) =>
            setNewCourse({ ...newCourse, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Syllabus"
          value={newCourse.syllabus}
          onChange={(e) =>
            setNewCourse({ ...newCourse, syllabus: e.target.value })
          }
        />
        <button onClick={createCourse}>Create Course</button>

        {editingCourse && (
          <div>
            <h3>Edit Course</h3>
            <input
              type="text"
              placeholder="Title"
              value={editingCourse.title}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={editingCourse.description}
              onChange={(e) =>
                setEditingCourse({
                  ...editingCourse,
                  description: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Syllabus"
              value={editingCourse.syllabus}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, syllabus: e.target.value })
              }
            />
            <button onClick={editCourse}>Save Changes</button>
            <button onClick={() => setEditingCourse(null)}>Cancel</button>
          </div>
        )}

        <h3>Manage Users</h3>
        <ul>
          {currentUsers.map((user) => (
            <li key={user.id}>
              {user.name} - {user.role}
              <button onClick={() => setEditingUser(user)}>Edit</button>
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <h3>Add New User</h3>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Role"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        />
        <button onClick={createUser}>Create User</button>

        {editingUser && (
          <div>
            <h3>Edit User</h3>
            <input
              type="text"
              placeholder="Name"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Role"
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
            />
            <button onClick={editUser}>Save Changes</button>
            <button onClick={() => setEditingUser(null)}>Cancel</button>
          </div>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= courses.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import Navbar from "./Navbar";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function TaskCard({ task, onDelete, onEdit }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-bold">{task.title}</h3>
      <p>{task.description}</p>
      <p className="text-gray-500 text-sm">Created at: {task.date} {task.time}</p>
      <div className="mt-2 flex gap-2">
        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => onDelete(task._id)}>Delete</button>
        <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => onEdit(task._id)}>Edit</button>
      </div>
    </div>
  );
}

function TaskColumn({ title, tasks, onDelete, onEdit }) {
  return (
    <div className="bg-blue-100 p-4 rounded w-1/3">
      <h2 className="text-blue-700 font-bold mb-4">{title}</h2>
      {tasks.map(task => (
        <TaskCard key={task._id} task={task} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}

function TaskBoard({ tasks, onDelete, onEdit }) {
  return (
    <div className="flex gap-4">
      <TaskColumn title="TODO" tasks={tasks.todo} onDelete={onDelete} onEdit={onEdit} />
      <TaskColumn title="IN PROGRESS" tasks={tasks.inProgress} onDelete={onDelete} onEdit={onEdit} />
      <TaskColumn title="DONE" tasks={tasks.done} onDelete={onDelete} onEdit={onEdit} />
    </div>
  );
}

export default function Task() {
    const [notice, setNotice] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editId, setEditId] = useState('');
    const [allTasks, setAllTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [formData, setFormData] = useState({
      title: '',
      description: '',
    });
  
    useEffect(() => {
      getAllTasks();
    }, []);
  
    const getAllTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/task/getAllTasks`);
        setAllTasks(response.data.tasks);
        setFilteredTasks(response.data.tasks);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch tasks. Please try again.');
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${API_URL}/api/v1/task/createTask`, formData);
        alert('Task created successfully!');
        setNotice(false);
        setFormData({ title: '', description: '' });
        await getAllTasks();
      } catch (error) {
        console.error(error);
        alert('Failed to create task. Please try again.');
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await axios.delete(`${API_URL}/api/v1/task/deleteTaskById/${id}`);
        alert('Task deleted successfully!');
        await getAllTasks();
      } catch (error) {
        console.error(error);
        alert('Failed to delete task. Please try again.');
      }
    };
  
    const handleEditSubmit = async () => {
      try {
        await axios.patch(`${API_URL}/api/v1/task/updateTaskById/${editId}`, formData);
        alert('Task information updated successfully!');
        setShowEdit(false);
        await getAllTasks();
      } catch (error) {
        console.error(error);
        alert('Failed to update task information. Please try again.');
      }
    };
  
    useEffect(() => {
      const getData = async () => {
        if (editId) {
          const res = await axios.get(`${API_URL}/api/v1/task/getTaskById/${editId}`);
          setFormData(res.data.task);
          setShowEdit(true);
        }
      };
      getData();
    }, [editId]);
  
    const handleSearch = (e) => {
      const searchQuery = e.target.value.toLowerCase();
      const filtered = allTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery) ||
        task.description.toLowerCase().includes(searchQuery)
      );
      setFilteredTasks(filtered);
    };
  
    const categorizedTasks = {
      todo: filteredTasks.filter(task => task.status === 'TODO'),
      inProgress: filteredTasks.filter(task => task.status === 'IN_PROGRESS'),
      done: filteredTasks.filter(task => task.status === 'DONE'),
    };

    return (
        <>
        <Navbar/>
            <div className="min-h-screen bg-gray-100">
                <main className="p-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={() => setNotice(true)}>Add Task</button>
                    <div className="bg-white p-4 shadow-md border rounded-md h-[60vh] overflow-x-auto">
                        <div className="flex justify-between mb-4">
                            <div>
                                <label className="p-2">Search:</label>
                                <input
                                    type="text"
                                    className="border p-1 rounded outline-blue-400"
                                    placeholder="search..."
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <TaskBoard tasks={categorizedTasks} onDelete={handleDelete} onEdit={setEditId} />
                    </div>
                </main>
                {notice && (
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-opacity-50 bg-gray-800">
                        <div className="w-1/3 mx-auto p-8 bg-white shadow-lg rounded">
                            <div className="font-bold text-xl mb-4">Add New Task</div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-zinc-700 text-sm font-bold mb-2" htmlFor="title">Task Title</label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter Task Title"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-zinc-700 text-sm font-bold mb-2" htmlFor="description">Task Description</label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="description"
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter Task Description"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button onClick={() => setNotice(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">Cancel</button>
                                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showEdit && (
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-opacity-50 bg-gray-800">
                        <div className="w-1/3 mx-auto p-8 bg-white shadow-lg rounded">
                            <div className="font-bold text-xl mb-4">Edit Task</div>
                            <form onSubmit={handleEditSubmit}>
                                <div className="mb-4">
                                    <label className="block text-zinc-700 text-sm font-bold mb-2" htmlFor="title">Task Title</label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter Task Title"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-zinc-700 text-sm font-bold mb-2" htmlFor="description">Task Description</label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="description"
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter Task Description"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button onClick={() => setShowEdit(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">Cancel</button>
                                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

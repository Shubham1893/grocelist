import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  
  // State for the form, works for both adding and editing
  const [formState, setFormState] = useState({ name: "", quantity: 1, price: 0, notes: "" });
  
  // State to track which item is being edited
  const [editingId, setEditingId] = useState(null); 

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { familyInfo } = useAuth(); 

  // Fetch initial data for the dashboard
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsRes, membersRes] = await Promise.all([
          API.get("/lists"),
          API.get("/family/members"),
        ]);
        setItems(itemsRes.data);
        setFamilyMembers(membersRes.data);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle changes in the form inputs
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormState({ 
        ...formState, 
        [name]: type === 'number' ? parseFloat(value) || 0 : value 
    });
  };
  
  // Reset form to its initial state
  const resetForm = () => {
    setFormState({ name: "", quantity: 1, price: 0, notes: "" });
    setEditingId(null);
  };

  // Handle form submission for both adding and updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name.trim()) return;

    if (editingId) {
      // --- UPDATE LOGIC ---
      try {
        const { data: updatedItem } = await API.put(`/lists/${editingId}`, formState);
        setItems(items.map((item) => (item._id === editingId ? updatedItem : item)));
        resetForm();
      } catch (err) {
        setError("Failed to update item.");
      }
    } else {
      // --- ADD LOGIC ---
      try {
        const { data: newItem } = await API.post("/lists/add", formState);
        setItems([newItem, ...items]);
        resetForm();
      } catch (err) {
        setError("Failed to add item.");
      }
    }
  };

  // Handle clicking the "Edit" button on an item
  const handleEditClick = (item) => {
    setEditingId(item._id);
    setFormState({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes || ""
    });
  };

  // Handle deleting an item
  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
        try {
          await API.delete(`/lists/${id}`);
          setItems(items.filter((i) => i._id !== id));
        } catch {
          setError("Failed to delete item.");
        }
    }
  };
  
  if (loading) return <div className="loading-spinner">Loading Dashboard...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
      {/* --- Grocery List Panel (Left) --- */}
      <div className="list-panel">
        <header className="list-header">
          <h1>{familyInfo?.name}'s Grocery List</h1>
          <p>Family Code: <span>{familyInfo?.code}</span></p>
        </header>
        
        {/* --- ADD/EDIT FORM --- */}
        <form onSubmit={handleSubmit} className="add-item-form">
          <h3>{editingId ? "Edit Item" : "Add a New Item"}</h3>
          <input name="name" value={formState.name} onChange={handleInputChange} placeholder="Item Name (e.g., Milk)" required />
          <div className="form-row">
            <input name="quantity" type="number" min="1" value={formState.quantity} onChange={handleInputChange} placeholder="Qty" />
            <input name="price" type="number" min="0" step="0.01" value={formState.price} onChange={handleInputChange} placeholder="Price ($)" />
          </div>
          <input name="notes" value={formState.notes} onChange={handleInputChange} placeholder="Notes (e.g., Low-fat)" />
          <div className="form-actions">
            <button type="submit" className="submit-btn">{editingId ? "Update Item" : "Add Item"}</button>
            {editingId && <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        {/* --- ITEM LIST --- */}
        <ul className="item-list">
          {items.length > 0 ? items.map((item) => (
            <li key={item._id} className="item-card">
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-meta">Qty: {item.quantity} | ${item.price.toFixed(2)}</span>
                {item.notes && <span className="item-notes">Notes: {item.notes}</span>}
                <span className="item-added-by">Added by {item.addedBy.name.split(' ')[0]}</span>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEditClick(item)} className="edit-btn">✏️</button>
                <button onClick={() => deleteItem(item._id)} className="delete-btn">🗑️</button>
              </div>
            </li>
          )) : <p className="empty-list">Your grocery list is empty. Add an item to get started!</p>}
        </ul>
      </div>

      {/* --- Family Members Panel (Right) --- */}
      <div className="family-panel">
        <h2>Family Members</h2>
        <ul className="member-list">
          {familyMembers.map((member) => (
            <li key={member.id} className="member-card">
              <img src={member.avatar} alt={member.firstName} className="member-avatar" />
              <span>{member.firstName}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect, FormEvent } from 'react';

interface Item {
  id: string;
  content: string;
}

export default function HomePage() {
  const [content, setContent] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null); 

  const API_URL = '/api/users';

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Item[] = await response.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Content cannot be empty.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      if (editingItem) {
        response = await fetch(API_URL, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: editingItem.id, content }),
        });
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await fetchItems();
      setContent(''); 
      setEditingItem(null); 
    } catch (err: any) {
      setError(err.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setContent(item.content);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Next.js Database Manager</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter content"
          style={{ width: 'calc(100% - 110px)', padding: '10px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Processing...' : (editingItem ? 'Update Item' : 'Add Item')}
        </button>
        {editingItem && (
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setContent('');
            }}
            style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '5px' }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {error && <p style={{ color: 'red', marginBottom: '15px' }}>Error: {error}</p>}

      <h2>Database Items</h2>
      {loading && !error && <p>Loading items...</p>}
      {!loading && items.length === 0 && <p>No items in the database.</p>}
      {!loading && items.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <li key={item.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: editingItem?.id === item.id ? '#f0f8ff' : 'white' }}>
              <span>
                <strong>ID:</strong> {item.id} <br />
                <strong>Content:</strong> {item.content}
              </span>
              <div>
                <button
                  onClick={() => handleEdit(item)}
                  style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
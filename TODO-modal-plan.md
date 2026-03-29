# Modal Implementation Plan

**Information Gathered** (from current Messages.jsx):
- Actions: conditional read/replied buttons + delete
- updateStatus/deleteMessage exist
- getStatusBadge, getWhatsAppLink ready
- Style jsx block for new .modal styles

**Plan**:
1. Add state: `const [selectedMsg, setSelectedMsg] = useState(null);`
2. Replace table actions block with:
```
<div className="table-actions">
  <button className="btn-icon btn-view" onClick={() => setSelectedMsg(msg)} title="View Details">
    <FiEye />
  </button>
  <button className="btn-icon btn-delete" onClick={() => deleteMessage(msg._id)} title="Delete">
    <FiTrash2 />
  </button>
</div>
```
3. Add import FiEye
4. Add after table (before </div>):
```
{selectedMsg && (
  <div className="message-modal-overlay" onClick={() => setSelectedMsg(null)}>
    <div className="message-modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Message Details</h3>
        <button className="modal-close" onClick={() => setSelectedMsg(null)}>
          <FiX />
        </button>
      </div>
      <div className="modal-body">
        <p><strong>Name:</strong> {selectedMsg.name}</p>
        <p><strong>Email:</strong> <a href={`mailto:${selectedMsg.email}`}>{selectedMsg.email}</a></p>
        <p><strong>WhatsApp:</strong> <a href={getWhatsAppLink(selectedMsg.whatsapp, selectedMsg.name)} target="_blank">{selectedMsg.whatsapp}</a></p>
        <p><strong>Date:</strong> {new Date(selectedMsg.createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> {getStatusBadge(selectedMsg.status)}</p>
        <p><strong>Full Message:</strong></p>
        <div className="full-message">{selectedMsg.message}</div>
        <div className="modal-actions">
          <select value={selectedMsg.status} onChange={(e) => updateStatus(selectedMsg._id, e.target.value)}>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
          <button className="btn-primary" onClick={() => setSelectedMsg(null)}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```
5. Add styles to jsx block.

**Followup**: Test after edits.

Ready to implement?


import { useState } from 'react';
import Modal from 'react-modal';

const NewMemoryModal = ({ isOpen, onRequestClose, onSave }) => {
    const [newMemory, setNewMemory] = useState('');

    const handleSave = () => {
        onSave(newMemory);
        setNewMemory('');
        onRequestClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal">
            <div className="p-4">
                <h3 className="text-xl mb-4">Add New Memory</h3>
                <Textarea
                    value={newMemory}
                    onChange={(e) => setNewMemory(e.target.value)}
                    placeholder="Enter your memory here"
                    className="min-h-[100px] border-blue-100 resize-none mb-4"
                />
                <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
                    Save
                </Button>
            </div>
        </Modal>
    );
};
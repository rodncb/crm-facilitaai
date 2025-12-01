import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { FaSmile } from 'react-icons/fa';
import './EmojiPickerInput.css';

const EmojiPickerInput = ({ value, onChange, placeholder, className }) => {
    const [showPicker, setShowPicker] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const onEmojiClick = (emojiObject) => {
        onChange(value + emojiObject.emoji);
        // Keep picker open for multiple emojis or close it? Usually keep open or close.
        // Let's keep it open for now or close it. User preference varies.
        // setShowPicker(false); 
    };

    return (
        <div className={`emoji-picker-input-container ${className || ''}`} ref={containerRef}>
            <div className="input-wrapper">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="emoji-input"
                    rows={3}
                />
                <button
                    type="button"
                    className="emoji-trigger-btn"
                    onClick={() => setShowPicker(!showPicker)}
                >
                    <FaSmile />
                </button>
            </div>
            {showPicker && (
                <div className="picker-popover">
                    <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        width="100%"
                        height={350}
                        previewConfig={{ showPreview: false }}
                    />
                </div>
            )}
        </div>
    );
};

export default EmojiPickerInput;

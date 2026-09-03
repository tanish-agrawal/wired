import React, { useState, useRef } from "react";
import { Send, Image, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, isSending, selectedChat } = useChat();
  const { emitTyping, emitStopTyping } = useSocket();

  const handleTextChange = (e) => {
    setText(e.target.value);

    if (selectedChat?.type === "direct") {
      emitTyping(selectedChat.data._id);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping(selectedChat.data._id);
      }, 2000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (selectedChat?.type === "direct") {
      emitStopTyping(selectedChat.data._id);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }

    const messageData = {
      text: text.trim(),
      image: imagePreview,
    };

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    await sendMessage(messageData);
  };

  return (
    <div className="p-4 bg-slate-900/90 border-t border-slate-800">
      {/* Image Preview Overlay */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700/80 w-fit">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Attachment preview"
              className="w-16 h-16 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-md transition"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="pr-2">
            <p className="text-xs font-medium text-slate-200">Image attached</p>
            <p className="text-[10px] text-slate-400">Ready to send</p>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-2.5 rounded-xl border transition-all ${
            imagePreview
              ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/50"
              : "bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700 hover:border-slate-600"
          }`}
          title="Attach Image"
        >
          <Image className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder={
            selectedChat?.type === "group"
              ? `Message #${selectedChat.data.name}...`
              : "Type a message..."
          }
          className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />

        <button
          type="submit"
          disabled={isSending || (!text.trim() && !imagePreview)}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-600 rounded-xl shadow-lg shadow-indigo-600/20 disabled:shadow-none transition-all duration-200 flex items-center justify-center min-w-[42px]"
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

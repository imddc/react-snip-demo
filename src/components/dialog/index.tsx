import ReactDOM from "react-dom/client";
import { selectOptions } from "./data";
import { useState } from "react";

interface DialogProps {
  image: string;
  options: { value: string; label: string }[];
  onClose?: () => void;
  onUpdate?: (v: string) => void;
  onDelete?: () => void;
}

const Dialog = ({
  image,
  options,
  onClose,
  onDelete,
  onUpdate,
}: DialogProps) => {
  const [selectedOption, setSelectedOption] = useState(selectOptions[0].value);
  const handleSelectChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100/50">
      <div className="bg-white w-196 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Image Detail</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex">
          <div className="flex-shrink-0 mr-4">
            <img
              className="w-200 object-cover rounded"
              src={image}
              alt="Image"
            />
          </div>
          <div className="flex-1">
            <form>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="select"
                >
                  Choose an option:
                </label>
                <select
                  id="select"
                  className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow-sm focus:outline-none focus:border-blue-500"
                  onChange={handleSelectChange}
                >
                  {selectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => onUpdate(selectedOption)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={onDelete}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

Dialog.alert = (props: DialogProps) => {
  const { onClose, onUpdate, onDelete } = props;
  const div = document.createElement("div");
  document.body.appendChild(div);

  const close = () => {
    document.body.removeChild(div);
    onClose && onClose();
  };

  const update = (v: string) => {
    onUpdate && onUpdate(v);
    close();
  };

  const deleteItem = () => {
    onDelete && onDelete();
    close();
  };

  ReactDOM.createRoot(div).render(
    <Dialog
      {...props}
      onClose={close}
      onUpdate={update}
      onDelete={deleteItem}
    />
  );
};

export default Dialog;

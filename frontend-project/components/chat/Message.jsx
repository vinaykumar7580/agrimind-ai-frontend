export default function Message({ role, text }) {
  return (
    <div
      className={`p-3 my-2 rounded-lg max-w-xl ${
        role === "user"
          ? "bg-green-600 text-white ml-auto"
          : "bg-gray-200 text-black mr-auto"
      }`}
    >
      {text}
    </div>
  );
}
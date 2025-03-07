// components/CaseList.jsx
import Link from "next/link";

export default function CaseList({ cases }) {
  if (!cases || cases.length === 0) {
    return <p className="text-gray-500 mt-4">No cases found.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {cases.map((item) => (
        <li key={item.id} className="py-4">
          <Link
            href={`/cases/${item.id}`}
            className="block hover:bg-gray-50 p-4 rounded-lg transition"
          >
            <h3 className="text-lg font-semibold text-blue-800">{item.name}</h3>
            <p className="text-sm text-gray-500">
              Created: {new Date(item.createdTime).toLocaleDateString()}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

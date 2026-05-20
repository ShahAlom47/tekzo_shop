"use client";

import { CustomTable } from "../CommonComponents/CustomTable";
import { User, UserRole } from "@/Interfaces/userInterfaces";
import { useConfirm } from "@/hook/useConfirm";
import { updateUserInfo } from "@/lib/allApiRequest/userRequest/userRequest";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast/headless";

interface Props {
  users: User[];
  currentUser: User;
}

const UserTable = ({ users, currentUser }: Props) => {
  const { confirm, ConfirmModal } = useConfirm();
  const queryClient = useQueryClient();

  const handleUpdate = async (
    userId: string,
    payload: { role?: UserRole; isActive?: boolean }
  ) => {
    const res = await updateUserInfo(userId, payload);

    if (res?.success) {
      toast.success("Updated ✅");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } else {
      toast.error("Update failed ❌");
    }
  };

  // ✅ Toggle Active (OWNER safe)
  const handleToggleActive = async (user: User) => {
    if (user._id?.toString() === currentUser._id?.toString()) {
      toast.error("You can't deactivate yourself ❌");
      return;
    }

    const ok = await confirm({
      title: "Change Status",
      message: "Are you sure?",
      confirmText: "Yes",
      cancelText: "Cancel",
    });

    if (!ok) return;

    handleUpdate(user._id!.toString(), {
      isActive: !user.isActive,
    });
  };

  // ✅ Role Change (OWNER safe)
  const handleRoleChange = async (user: User, role: UserRole) => {
    // ❌ cannot change OWNER
    if (user.role === "OWNER") {
      toast.error("OWNER role can't be changed ❌");
      return;
    }

    handleUpdate(user._id!.toString(), { role });
  };

  const columns = [
    { header: "Name", accessor: "fullName" },
    { header: "Phone", accessor: "phone" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "status" },
  ];

  const data = users.map((user) => {
    const isSelf = user._id?.toString() === currentUser._id?.toString();
    const isOwner = user.role === "OWNER";

    return {
      fullName: user.fullName,
      phone: user.phone,

      role:
        currentUser.role === "OWNER" ? (
          <select
            value={user.role}
            disabled={isOwner} // 🔥 OWNER disable
            onChange={(e) =>
              handleRoleChange(user, e.target.value as UserRole)
            }
            className={`border p-1 rounded disabled:bg-gray-100 disabled:text-gray-500 cursor-pointer`}
          >
            {/* 🔥 OWNER role can't be changed */}
            <option value="OWNER" disabled>OWNER</option>
            <option value="MANAGER">MANAGER</option>
            <option value="SALESMAN">SALESMAN</option>
            <option value="USER">USER</option>
          </select>
        ) : (
          <span className="text-gray-500 ">{user.role}</span>
        ),

      status:
        currentUser.role === "OWNER" ? (
          <button
            disabled={isSelf} // 🔥 self disable
            onClick={() => handleToggleActive(user)}
            className={`px-2 py-1 text-white rounded cursor-pointer ${
              user.isActive ? "bg-green-500" : "bg-red-500"
            } disabled:opacity-50`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </button>
        ) : (
          <span
            className={`px-2 py-1 rounded  ${
              user.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
        ),
    };
  });

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">👤 Users</h2>

      <CustomTable columns={columns} data={data} />

      {ConfirmModal}
    </div>
  );
};

export default UserTable;
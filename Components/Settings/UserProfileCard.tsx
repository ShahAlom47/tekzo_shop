import { User } from "@/Interfaces/userInterfaces";
import {
  updateUserInfo,
  updateUserPassword,
} from "@/lib/allApiRequest/userRequest/userRequest";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

export function ProfileCard({ currentUser }: { currentUser: User }) {
  const [editing, setEditing] = useState<"none" | "name" | "password">("none");

  const [name, setName] = useState(currentUser?.fullName || "");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // 👉 Name Save
  const handleNameSave = async () => {
    const id = currentUser?._id?.toString();

    if (!id) {
      toast.error("User ID not found");
      return;
    }

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const res = await updateUserInfo(id, { fullName: name });

      if (res?.success) {
        toast.success("Name updated successfully");
        setEditing("none");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      } else {
        toast.error(res?.message || "Update failed");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 👉 Password Save
  const handlePasswordSave = async () => {
    const id = currentUser?._id?.toString();

    if (!id) {
      toast.error("User ID not found");
      return;
    }

    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      toast.error("Old & New password required");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await updateUserPassword(id, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res?.success) {
        toast.success("Password updated successfully");
        setPasswordForm({ oldPassword: "", newPassword: "" });
        setEditing("none");
      } else {
        toast.error(res?.message || "Password update failed");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Profile</h2>
      </div>

      {/* Name Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p>
            <strong>Name:</strong> {currentUser?.fullName}
          </p>

          {editing !== "name" && (
            <button
              onClick={() => {
                setEditing("name");
                setName(currentUser?.fullName || "");
              }}
              className="text-sm bg-black text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          )}
        </div>

        {editing === "name" && (
          <div className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <div className="flex gap-2">
              <button
                onClick={handleNameSave}
                disabled={loading}
                className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing("none")}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p>
            <strong>Password:</strong> ********
          </p>

          {editing !== "password" && (
            <button
              onClick={() => setEditing("password")}
              className="text-sm bg-black text-white px-3 py-1 rounded"
            >
              Change
            </button>
          )}
        </div>

        {editing === "password" && (
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Old Password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  oldPassword: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            />

            <div className="flex gap-2">
              <button
                onClick={handlePasswordSave}
                disabled={loading}
                className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update"}
              </button>
              <button
                onClick={() => setEditing("none")}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Role */}
      <p className="text-sm text-gray-600">
        <strong>Role:</strong> {currentUser?.role}
      </p>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUserPlus,
  FaEnvelope,
  FaComment,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import ProfileView from "../components/ProfileView";
import AddFriendModal from "../components/AddFriendModal";
import { User, FriendRequest, FriendRequestStatus } from "../types";
import {
  getFriendRequests,
  getFriends,
  getProfile,
  sendFriendRequest,
} from "../utils/api";

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchFriends();
    fetchFriendRequests();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = getProfile();
      setCurrentUserId((await response).data.id);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await getFriends();
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = getFriendRequests();
      setFriendRequests((await response).data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const handleFriendRequest = async (
    requestId: number,
    status: "accepted" | "rejected"
  ) => {
    try {
      await getFriendRequests();
      if (status === "accepted") {
        fetchFriends();
      }
      fetchFriendRequests();
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  const handleSendFriendRequest = async (
    request: Omit<FriendRequest, "id" | "createdAt">
  ) => {
    try {
      await sendFriendRequest(request);
      // Optionally, you can show a success message here
    } catch (error) {
      console.error("Error sending friend request:", error);
      // Optionally, you can show an error message here
    }
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box",
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}>
        <h1 style={{ color: "var(--primary-color)" }}>Friends</h1>
        <button
          onClick={() => setIsAddFriendModalOpen(true)}
          style={{
            background: "var(--primary-color)",
            color: "white",
            border: "none",
            borderRadius: "25px",
            padding: "10px 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
          <FaUserPlus style={{ marginRight: "10px" }} /> Add Friend
        </button>
      </div>

      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2>Friend Requests</h2>
          {friendRequests.map((request) => (
            <div
              key={request.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                background: "var(--surface-color)",
                padding: "10px",
                borderRadius: "10px",
              }}>
              <img
                src={request.avatar || "/default-avatar.png"}
                alt={request.name}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <span style={{ flex: 1 }}>
                {request.name} (@{request.username})
              </span>
              <button
                onClick={() => handleFriendRequest(request.id, "accepted")}
                style={{
                  background: "var(--primary-color)",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}>
                <FaCheck /> Accept
              </button>
              <button
                onClick={() => handleFriendRequest(request.id, "rejected")}
                style={{
                  background: "var(--secondary-color)",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}>
                <FaTimes /> Reject
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "var(--surface-color)",
          borderRadius: "25px",
          padding: "10px 20px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}>
        <FaSearch style={{ color: "var(--text-color)", marginRight: "10px" }} />
        <input
          type="text"
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            border: "none",
            background: "transparent",
            color: "var(--text-color)",
            fontSize: "16px",
            outline: "none",
            width: "100%",
          }}
        />
      </div>

      {/* Friends List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
        }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}>
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              style={{
                background: "var(--surface-color)",
                borderRadius: "15px",
                padding: "20px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => setSelectedFriend(friend)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }>
              <img
                src={friend.avatar || "/default-avatar.png"}
                alt={friend.name}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  marginBottom: "10px",
                }}
              />
              <div
                style={{
                  fontWeight: "bold",
                  color: "var(--text-color)",
                  textAlign: "center",
                  marginBottom: "5px",
                }}>
                {friend.name}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--text-color)",
                  opacity: 0.7,
                  marginBottom: "15px",
                }}>
                @{friend.username}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "15px",
                    color: "var(--primary-color)",
                    fontSize: "20px",
                  }}
                  title="Send Message"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add message functionality
                  }}>
                  <FaComment />
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--secondary-color)",
                    fontSize: "20px",
                  }}
                  title="Send Email"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add email functionality
                  }}>
                  <FaEnvelope />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedFriend && (
        <ProfileView
          friend={selectedFriend}
          onClose={() => setSelectedFriend(null)}
        />
      )}

      {isAddFriendModalOpen && (
        <AddFriendModal
          onClose={() => setIsAddFriendModalOpen(false)}
          currentUserId={currentUserId!}
          onSendFriendRequest={handleSendFriendRequest}
        />
      )}
    </div>
  );
};

export default Friends;

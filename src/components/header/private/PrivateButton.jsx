import React, { useEffect } from "react";
import styles from "./PrivateButton.module.css";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../../api/rtkApi";

export default function PrivateButton() {
  const navigate = useNavigate();

  const { data: currentUser, isLoading, error } = useGetCurrentUserQuery();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/authPage");
    }
  }, [isLoading, currentUser, navigate]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading user data. Please try again later.</p>;
  }

  return (
    <div className={styles.private_wrapper}>
      <button
        onClick={() => navigate(`/authPage`)}
        title="Личный кабинет"
        className={styles.private_button}
      ></button>

      {currentUser && (
        <output className={styles.private_output}>
          {currentUser.role !== "guest" ? currentUser.username : "Гость"}
        </output>
      )}
    </div>
  );
}

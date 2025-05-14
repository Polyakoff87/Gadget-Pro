import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetCurrentUserQuery,
  useResetAllUsersIsCurrentMutation,
  useUpdateUserIsCurrentMutation,
  useConfirmOrderMutation,
  useCancelOrderMutation,
} from "../../../api/rtkApi";
import styles from "./PrivateCabinet.module.css";
import CustomPopup from "../../../components/popups/CustomPopup";
import { useOrdersContext } from "../../../context/OrdersContext";
import { useTheme } from "../../../context/ThemeContext";

export default function PrivateCabinet() {
  const navigate = useNavigate();
  const {
    userOrders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useOrdersContext();
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useGetCurrentUserQuery();
  const [popupMessage, setPopupMessage] = useState("");
  const [resetAllUsersIsCurrent] = useResetAllUsersIsCurrentMutation();
  const [updateUserIsCurrent] = useUpdateUserIsCurrentMutation();
  const [confirmOrder] = useConfirmOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const { theme } = useTheme();

  const orders = userOrders?.orders || [];
  const ordersHistory = userOrders?.ordersHistory || [];

  const handleLogoutClick = async () => {
    try {
      await resetAllUsersIsCurrent().unwrap();
      await updateUserIsCurrent({ id: "2", isCurrent: true }).unwrap();
      navigate("/login");
    } catch (err) {
      setPopupMessage("Не удалось выполнить выход, попробуйте еще раз.");
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await confirmOrder({ userId: user.id, orderId }).unwrap();
      setPopupMessage("Order confirmed and moved to history!");
    } catch (err) {
      setPopupMessage("Failed to confirm order. Please try again.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder({ userId: user.id, orderId }).unwrap();
      setPopupMessage("Order canceled successfully!");
    } catch (err) {
      setPopupMessage("Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className={styles.private_cabinet_wrapper}>
      {(userLoading || ordersLoading) && <p>Loading data...</p>}
      {(userError || ordersError) && <p>Error loading data</p>}
      {user && (
        <>
          <div className={styles.private_cabinet_header}>
            <h2>Добро пожаловать в личный кабинет, {user?.username}!</h2>
            <p>
              Здесь Вы можете подтвердить или отменить заказ и посмотреть
              историю заказов.
            </p>
          </div>

          <div className={styles.order_history}>
            <h3>Ваши текущие заказы</h3>
            {orders.length > 0 ? (
              <div className={styles.order_cards}>
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className={`${styles.order_card} ${styles[theme]}`}
                  >
                    <img
                      src={order.productImg}
                      alt={order.productName}
                      className={styles.order_image}
                    />
                    <div className={styles.order_details}>
                      <p>
                        <span>ID заказа:</span> {order.orderId}
                      </p>
                      <p>
                        <span>Товар:</span> {order.productName}
                      </p>
                      <p>
                        <span>Стоимость:</span> {order.productPrice}
                      </p>
                      <p>
                        <span>Дата:</span>{" "}
                        {new Date(order.orderTime).toLocaleString()}
                      </p>
                      <div className={styles.cardActions}>
                        <button
                          onClick={() => handleConfirmOrder(order.orderId)}
                          className={styles.confirm_button}
                        >
                          Подтвердить заказ
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.orderId)}
                          className={styles.cancel_button}
                        >
                          Отменить заказ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>У Вас пока нет заказов.</p>
            )}
          </div>

          <div className={styles.order_history}>
            <h3>История Ваших заказов</h3>
            {ordersHistory.length > 0 ? (
              <div className={styles.order_cards}>
                {ordersHistory.map((order) => (
                  <div
                    key={order.orderId}
                    className={`${styles.order_card} ${styles[theme]}`}
                  >
                    <img
                      src={order.productImg}
                      alt={order.productName}
                      className={styles.order_image}
                    />
                    <div className={styles.order_details}>
                      <p>
                        <span>ID заказа:</span> {order.orderId}
                      </p>
                      <p>
                        <span>Товар:</span> {order.productName}
                      </p>
                      <p>
                        <span>Стоимость:</span> {order.productPrice}
                      </p>
                      <p>
                        <span>Дата:</span>{" "}
                        {new Date(order.orderTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Ваша история заказов пока пуста.</p>
            )}
          </div>

          <div className={styles.auth_button_wrapper}>
            <button onClick={handleLogoutClick} className={styles.auth_button}>
              Выйти из аккаунта
            </button>
          </div>
        </>
      )}

      {popupMessage && (
        <CustomPopup
          message={popupMessage}
          onClose={() => setPopupMessage("")}
        />
      )}
    </div>
  );
}

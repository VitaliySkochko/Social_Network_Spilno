// Панель адміністратора
import React from "react";
import { Link, useParams } from "react-router-dom";
import '../../styles/AdminPanel.css'

const AdminPanel = () => {
  const { id: communityId } = useParams(); // Отримуємо ID спільноти

  return (
    <div className="admin-panel">
      <h2>Панель адміністратора</h2>
      <p>Тут ви можете керувати спільнотою, публікаціями та учасниками.</p>
      <div className="admin-panel-group">
      <Link to={`/edit-community/${communityId}`} className="button-menu">Редагувати спільноту</Link>
      </div>
    </div>
  );
};

export default AdminPanel;

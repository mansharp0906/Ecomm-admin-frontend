import React from 'react';
import {
  MdDashboard,
  MdBusinessCenter,
  MdSettings,
} from 'react-icons/md';
import { FiBox } from 'react-icons/fi';
import { FaClipboardList, FaUsersCog,FaStore  } from 'react-icons/fa';
import { TbPackageExport } from 'react-icons/tb';
import { RiCoupon3Line } from 'react-icons/ri';
import { AiOutlineBarChart } from 'react-icons/ai';

// Example with distinct colors for each icon
export const DashboardIcon = () => <MdDashboard size={24} color="#4CAF50" />;           // Green
export const ProductIcon = () => <FiBox size={24} color="#2196F3" />;                   // Blue
export const OrderIcon = () => <FaClipboardList size={24} color="#FF9800" />;           // Orange
export const ProductManagementIcon = () => <TbPackageExport size={24} color="#9C27B0" />; // Purple
export const PromotionIcon = () => <RiCoupon3Line size={24} color="#E91E63" />;         // Pink
export const ReportsIcon = () => <AiOutlineBarChart size={24} color="#3F51B5" />;       // Indigo
export const UserManagementIcon = () => <FaUsersCog size={24} color="#009688" />;       // Teal
export const BusinessSettingsIcon = () => <MdBusinessCenter size={24} color="#795548" />; // Brown
export const SystemSettingsIcon = () => <MdSettings size={24} color="#607D8B" />;       // Blue Grey
export const StoreIcon = () => <FaStore size={24} color="#607D8B"/>

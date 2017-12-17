-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 17, 2017 at 09:16 AM
-- Server version: 10.1.25-MariaDB
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `CA_TT`
--

-- --------------------------------------------------------

--
-- Table structure for table `CATT`
--

CREATE TABLE `CATT` (
  `id` int(100) NOT NULL,
  `email` varchar(256) COLLATE utf8_vietnamese_ci NOT NULL,
  `password` varchar(256) COLLATE utf8_vietnamese_ci NOT NULL,
  `check_login` varchar(100) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Dumping data for table `CATT`
--

INSERT INTO `CATT` (`id`, `email`, `password`, `check_login`) VALUES
(1, 'tranhuytiep95@gmail.com', '$2a$08$XQg2pM96w16UCd2nZIm7AuQWUZ54kNaW66kaN5Rez.Djw2a3w.ZAq', 'bf1ed10a87e910311d734f48f412064be6a29c8bbdbbfc2cdf88ace33d11cb7d');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `CATT`
--
ALTER TABLE `CATT`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `CATT`
--
ALTER TABLE `CATT`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

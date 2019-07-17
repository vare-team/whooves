--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` varchar(18) NOT NULL,
  `lvl` int(10) unsigned NOT NULL,
  `xp` int(10) unsigned NOT NULL,
  `money` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `guilds`
--

CREATE TABLE `guilds` (
  `id` varchar(18) NOT NULL,
  `prefix` varchar(5) NOT NULL DEFAULT 'a.',
  `logchannel` varchar(18) NOT NULL,
  `moneyico` varchar(54) NOT NULL DEFAULT '💸',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

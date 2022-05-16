-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Tempo de geração: 08/08/2020 às 20:20
-- Versão do servidor: 10.4.11-MariaDB
-- Versão do PHP: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `monitoramento`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `anexo`
--

CREATE TABLE `anexo` (
  `id` int(11) NOT NULL,
  `nome_arquivo` text NOT NULL,
  `id_pessoa` int(11) NOT NULL,
  `id_historico` int(11) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `tamanho` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `anexo`
--

INSERT INTO `anexo` (`id`, `nome_arquivo`, `id_pessoa`, `id_historico`, `tipo`, `tamanho`) VALUES
(1, 'GABRIEL ENES GARANTIZADO - Tue Mar 03 2020 08:36:18 GMT-0400 (Horário Padrão do Amazonas).png', 1, 1, 'image/png', 0),
(2, 'BRUNO COSTA DE OLIVEIRA - Tue Mar 03 2020 10:06:18 GMT-0400 (Horário Padrão do Amazonas).png', 2, 2, 'image/png', 0),
(3, 'RENATO ANDRE DA COSTA MONTE - Tue Mar 03 2020 10:44:34 GMT-0400 (Horário Padrão do Amazonas).png', 3, 3, 'image/png', 0),
(4, 'EDERSON DA CRUZ DOMINGOS - Mon Mar 09 2020 10:20:39 GMT-0400 (Horário Padrão do Amazonas).png', 4, 4, 'image/png', 0),
(5, 'JACKSON DE AZEVEDO COSTA JUNIOR - Mon Mar 09 2020 10:43:14 GMT-0400 (Horário Padrão do Amazonas).png', 5, 5, 'image/png', 0),
(6, 'Rick Jones - Mon Mar 09 2020 11:51:02 GMT-0400 (Horário Padrão do Amazonas).png', 6, 6, 'image/png', 0),
(7, 'Sainy Chagas - Mon Mar 09 2020 11:56:56 GMT-0400 (Horário Padrão do Amazonas).png', 7, 7, 'image/png', 0),
(8, 'Daniel Santiago - Mon Mar 09 2020 12:44:39 GMT-0400 (Horário Padrão do Amazonas).png', 8, 8, 'image/png', 0),
(9, 'Bruno Hitotuzi - Mon Mar 09 2020 14:57:12 GMT-0400 (Horário Padrão do Amazonas).png', 9, 9, 'image/png', 0),
(10, 'Duivilly Brito - Mon Mar 09 2020 16:52:55 GMT-0400 (Horário Padrão do Amazonas).png', 10, 10, 'image/png', 0),
(11, 'GILMAR ALVES DE ALMEIDA - Tue Mar 10 2020 09:33:11 GMT-0400 (Horário Padrão do Amazonas).png', 11, 11, 'image/png', 0),
(12, 'ALAN DE ANDRADE SAMPAIO - Tue Mar 10 2020 09:35:54 GMT-0400 (Horário Padrão do Amazonas).png', 12, 12, 'image/png', 0),
(13, 'MARCIO GABRIEL CAPLAN DE ARAUJO - Tue Mar 10 2020 09:50:47 GMT-0400 (Horário Padrão do Amazonas).png', 13, 13, 'image/png', 0),
(14, 'FELIPE AUGUSTO DE MENEZES - Tue Mar 10 2020 09:57:28 GMT-0400 (Horário Padrão do Amazonas).png', 14, 14, 'image/png', 0),
(15, 'RODRIGO AUGUSTO PINTO MOURA - Tue Mar 10 2020 10:01:10 GMT-0400 (Horário Padrão do Amazonas).png', 15, 15, 'image/png', 0),
(16, 'MARCOS NERES PEREIRA - Tue Mar 10 2020 10:07:18 GMT-0400 (Horário Padrão do Amazonas).png', 16, 16, 'image/png', 0),
(17, 'SERGIO CARVALHO DA SILVA - Tue Mar 10 2020 12:01:23 GMT-0400 (Horário Padrão do Amazonas).png', 17, 17, 'image/png', 0),
(18, 'EGERANIA GOUVEIA DE MATOS - Tue Mar 10 2020 12:07:32 GMT-0400 (Horário Padrão do Amazonas).png', 18, 18, 'image/png', 0),
(19, 'Jaime lopes dos santos - Wed Mar 11 2020 13:44:00 GMT-0400 (Horário Padrão do Amazonas).png', 19, 19, 'image/png', 0),
(20, 'CLAUDIO RODRIGUES LIMA SOUSA - Thu Mar 12 2020 10:23:48 GMT-0400 (Horário Padrão do Amazonas).png', 20, 20, 'image/png', 0),
(21, 'FERNANDO YUKIO MIYADAIRA - Thu Mar 12 2020 10:27:25 GMT-0400 (Horário Padrão do Amazonas).png', 21, 21, 'image/png', 0),
(22, 'ROQUE GOMES PEREIRA - Thu Mar 12 2020 11:23:10 GMT-0400 (Horário Padrão do Amazonas).png', 22, 22, 'image/png', 0),
(23, 'GIOVANNE FALABELLA SCOTTI - Thu Mar 12 2020 11:46:15 GMT-0400 (Horário Padrão do Amazonas).png', 23, 23, 'image/png', 0),
(24, 'RENATO BASILIO DE CARVALHO - Thu Mar 12 2020 11:47:14 GMT-0400 (Horário Padrão do Amazonas).png', 24, 24, 'image/png', 0),
(25, 'NICOLE MARQUES FEITOSA - Thu Mar 12 2020 11:59:26 GMT-0400 (Horário Padrão do Amazonas).png', 25, 25, 'image/png', 0),
(26, 'FRANCISCO CARLOS RAMOS DE AZEVEDO  - Thu Mar 12 2020 13:34:02 GMT-0400 (Horário Padrão do Amazonas).png', 26, 26, 'image/png', 0),
(27, 'JANAINA DE ABREU VASCONCELOS - Thu Mar 12 2020 13:35:54 GMT-0400 (Horário Padrão do Amazonas).png', 27, 27, 'image/png', 0),
(28, 'FABRICIO PEREIRA DE MENEZES - Fri Mar 13 2020 08:57:30 GMT-0400 (Horário Padrão do Amazonas).png', 28, 28, 'image/png', 0),
(29, 'CAMILO MOREIRA FERREIRA - Fri Mar 13 2020 09:02:53 GMT-0400 (Horário Padrão do Amazonas).png', 29, 29, 'image/png', 0),
(30, 'FABIO MAJELA CUNHA GARCIA - Fri Mar 13 2020 09:20:40 GMT-0400 (Horário Padrão do Amazonas).png', 30, 30, 'image/png', 0),
(31, 'MARLO RICARDO SOUZA DOS SANTOS - Fri Mar 13 2020 09:32:21 GMT-0400 (Horário Padrão do Amazonas).png', 31, 31, 'image/png', 0),
(32, 'MARIA DE GUADALUPE DIAS DO NASCIMENTO - Fri Mar 13 2020 09:34:57 GMT-0400 (Horário Padrão do Amazonas).png', 32, 32, 'image/png', 0),
(33, 'ERIVAN ALBUQUERQUE DE OLIVEIRA - Fri Mar 13 2020 09:39:22 GMT-0400 (Horário Padrão do Amazonas).png', 33, 33, 'image/png', 0),
(34, 'GEISE GUIMARAES MILANEZ - Fri Mar 13 2020 09:40:23 GMT-0400 (Horário Padrão do Amazonas).png', 34, 34, 'image/png', 0),
(35, 'JEAN ITALO COLARES DE ALMEIDA - Fri Mar 13 2020 09:54:47 GMT-0400 (Horário Padrão do Amazonas).png', 35, 35, 'image/png', 0),
(36, ' RAFAEL DAGOSTINI SCHMIDT - Fri Mar 13 2020 10:53:42 GMT-0400 (Horário Padrão do Amazonas).png', 36, 36, 'image/png', 0),
(37, 'CLEOGENES GUEDES GOMES - Fri Mar 13 2020 11:48:53 GMT-0400 (Horário Padrão do Amazonas).png', 37, 37, 'image/png', 0),
(38, 'AUGUSTO HENRIQUE CARNEIRO DE LIMA - Tue Mar 17 2020 10:35:50 GMT-0400 (Horário Padrão do Amazonas).png', 38, 38, 'image/png', 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `camera`
--

CREATE TABLE `camera` (
  `id` int(11) NOT NULL,
  `login` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `host` varchar(100) NOT NULL,
  `porta` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico_registro`
--

CREATE TABLE `historico_registro` (
  `id` int(11) NOT NULL,
  `id_pessoa` int(11) NOT NULL,
  `id_setor` int(11) NOT NULL,
  `data_entrada` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_saida` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `observacao` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `historico_registro`
--

INSERT INTO `historico_registro` (`id`, `id_pessoa`, `id_setor`, `data_entrada`, `data_saida`, `observacao`) VALUES
(1, 1, 11, '2020-03-03 12:36:00', '2020-03-03 12:36:00', 'ok'),
(2, 2, 16, '2020-03-03 14:06:00', '2020-03-03 14:06:00', 'FUNC. AMAZON COPY PARA MANUTENÇÃO'),
(3, 3, 16, '2020-03-03 14:44:00', '2020-03-03 14:44:00', 'FALAR COM O CEL.PAIVA'),
(4, 4, 13, '2020-03-09 14:20:00', '2020-03-09 14:20:00', 'VISITA AO DEPLAN - FALAR COM CIBELE'),
(5, 5, 6, '2020-03-09 14:43:00', '2020-03-09 14:43:00', 'VISITA NO SETOR DA COORDENAÇÃO DE ESTAGIO'),
(6, 6, 1, '2020-03-09 15:51:00', '2020-03-09 15:51:00', 'Teste.'),
(7, 7, 1, '2020-03-09 15:56:00', '2020-03-09 15:56:00', 'TESTE.'),
(8, 8, 1, '2020-03-09 16:44:00', '2020-03-09 16:44:00', 'TESTE.'),
(9, 9, 1, '2020-03-09 18:57:00', '2020-03-09 18:57:00', 'TESTE.'),
(10, 10, 1, '2020-03-09 20:52:00', '2020-03-09 20:52:00', 'TESTE.'),
(11, 11, 11, '2020-03-10 13:33:00', '2020-03-10 13:33:00', 'VISITA AO MAJOR QUINTINO'),
(12, 12, 14, '2020-03-10 13:35:00', '2020-03-10 13:35:00', 'FALAR COM SR. MAURO. INV ALAN TONANTINS'),
(13, 13, 5, '2020-03-10 13:50:00', '2020-03-10 13:50:00', 'REUNIÃO NO ESFRON COM CEL. ALMIR'),
(14, 14, 6, '2020-03-10 13:57:00', '2020-03-10 13:57:00', 'SERVIDOR DO IML '),
(15, 15, 5, '2020-03-10 14:01:00', '2020-03-10 14:01:00', 'REUNIÃO NA ESFRON CEL. ALMIR '),
(16, 16, 14, '2020-03-10 14:07:00', '2020-03-10 14:07:00', 'IDA AO GAGIS PEGAR MATERIAL'),
(17, 17, 26, '2020-03-10 16:01:00', '2020-03-10 16:01:00', 'TESTE'),
(18, 18, 9, '2020-03-10 16:07:00', '2020-03-10 16:07:00', 'TESTE'),
(19, 19, 14, '2020-03-11 17:43:00', '2020-03-11 17:43:00', 'Entregar convinte no Gagis'),
(20, 20, 17, '2020-03-12 14:23:00', '2020-03-12 14:23:00', 'FALAR COM O CEL.GONÇALVES (CH.GAB)'),
(21, 21, 23, '2020-03-12 14:27:00', '2020-03-12 14:27:00', 'IDA A ASSESSORIA DE IMPRENSA'),
(22, 22, 25, '2020-03-12 15:23:00', '2020-03-12 15:23:00', 'IDA A GER. CONTRATOS '),
(23, 23, 5, '2020-03-12 15:46:00', '2020-03-12 15:46:00', 'REUNIÃO CEL. ALMIR ESFRON'),
(24, 24, 5, '2020-03-12 15:47:00', '2020-03-12 15:47:00', 'REUNIAO CEL. ALMIR ESFRON'),
(25, 25, 6, '2020-03-12 15:59:00', '2020-03-12 15:59:00', 'CONTRATO DE ESTAGIO'),
(26, 26, 3, '2020-03-12 17:34:00', '2020-03-12 17:34:00', 'VISITA AO SETOR DE COMPRAS '),
(27, 27, 6, '2020-03-12 17:35:00', '2020-03-12 17:35:00', 'CONTRATO DE ESTAGIO NATASHA'),
(28, 28, 23, '2020-03-13 12:57:00', '2020-03-13 12:57:00', 'IDA A ASS. IMPRENSA '),
(29, 29, 16, '2020-03-13 13:02:00', '2020-03-13 13:02:00', 'FALAR COM HERICK LOBO (GSE)'),
(30, 30, 16, '2020-03-13 13:20:00', '2020-03-13 13:20:00', 'REUNIÃO CEL. PAIVA'),
(31, 31, 5, '2020-03-13 13:32:00', '2020-03-13 13:32:00', 'REUNIAO CEL. ALMIR'),
(32, 32, 7, '2020-03-13 13:34:00', '2020-03-13 13:34:00', 'ENC. A SEAOP'),
(33, 33, 5, '2020-03-13 13:39:00', '2020-03-13 13:39:00', 'REUNIAO CEL. ALMIR'),
(34, 34, 5, '2020-03-13 13:40:00', '2020-03-13 13:40:00', 'REUNIAO CEL. ALMIR'),
(35, 35, 16, '2020-03-13 13:54:00', '2020-03-13 13:54:00', 'ENTREGA DOC. P/ ERICK LOBO (GSE) '),
(36, 36, 14, '2020-03-13 14:53:00', '2020-03-13 14:53:00', 'IDA AO GAGIS PEGAR MATERIAL DEL. MAUÉS'),
(37, 37, 6, '2020-03-13 15:48:00', '2020-03-13 15:48:00', 'IDA AO RH CADASTRO DE PONTO'),
(38, 38, 16, '2020-03-17 14:35:00', '2020-03-17 14:35:00', 'FALAR COM O SECRETÁRIO EXECUTIVO- \nREPRESENTANTE DA EMPRESA JURUÁ ESTALEIRO');

-- --------------------------------------------------------

--
-- Estrutura para tabela `livro_ocorrencia`
--

CREATE TABLE `livro_ocorrencia` (
  `id` int(11) NOT NULL,
  `descricao_ocorrencia` text NOT NULL,
  `data` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `log_monitoramento`
--

CREATE TABLE `log_monitoramento` (
  `id` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `status_pessoa` int(11) NOT NULL,
  `distancia` varchar(30) NOT NULL,
  `data_instante` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `camera` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `log_monitoramento`
--

INSERT INTO `log_monitoramento` (`id`, `nome`, `cpf`, `status_pessoa`, `distancia`, `data_instante`, `camera`) VALUES
(1, 'SAINY CHAGAS', '22467607', 1, ' 0.419983051112174', '2020-03-09 11:58:11', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(2, 'SAINY CHAGAS', '22467607', 1, ' 0.32816384457723624', '2020-03-09 12:00:31', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(3, 'SAINY CHAGAS', '22467607', 1, ' 0.341668212447241', '2020-03-09 12:01:00', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(4, 'SAINY CHAGAS', '22467607', 1, ' 0.35436150542934686', '2020-03-09 12:35:07', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(5, 'SAINY CHAGAS', '22467607', 1, ' 0.30541295029063853', '2020-03-09 13:35:04', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(6, 'DANIEL SANTIAGO', '23705566', 1, ' 0.4172958919011172', '2020-03-09 15:11:03', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(7, 'DUIVILLY BRITO', '27339122', 1, ' 0.3868627467291432', '2020-03-10 07:28:46', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(8, 'SAINY CHAGAS', '22467607', 1, ' 0.38877610987209726', '2020-03-10 07:52:26', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(9, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.41461322764099917', '2020-03-10 10:25:33', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(10, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.41491188003154833', '2020-03-10 11:22:27', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(11, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.3962357138105746', '2020-03-10 11:59:16', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(12, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.41986909270965506', '2020-03-10 11:59:20', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(13, 'EGERANIA GOUVEIA DE MATOS', '22505091', 1, ' 0.42813374959183753', '2020-03-10 12:10:44', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(14, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.4013424683316607', '2020-03-10 13:49:32', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(15, 'BRUNO HITOTUZI', '15986535', 1, ' 0.4252408571970908', '2020-03-10 17:33:41', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(16, 'SAINY CHAGAS', '22467607', 1, ' 0.3882634803048724', '2020-03-11 07:49:58', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(17, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.4258670667633517', '2020-03-11 08:06:38', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(18, 'BRUNO HITOTUZI', '15986535', 1, ' 0.3892885045694504', '2020-03-11 12:27:23', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(19, 'BRUNO HITOTUZI', '15986535', 1, ' 0.340575648080032', '2020-03-11 12:27:28', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(20, 'SAINY CHAGAS', '22467607', 1, ' 0.36691418854544944', '2020-03-11 12:30:56', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(21, 'SAINY CHAGAS', '22467607', 1, ' 0.3108221824995038', '2020-03-11 12:31:00', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(22, 'RICK JONES', '15244687', 1, ' 0.3923426536006622', '2020-03-11 17:11:10', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(23, 'FERNANDO YUKIO MIYADAIRA', '00020796', 1, ' 0.41522398548916206', '2020-03-12 14:44:25', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(24, 'SAINY CHAGAS', '22467607', 1, ' 0.4103707353944173', '2020-03-16 11:57:55', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(25, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.42752864177477257', '2020-03-16 12:34:00', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(26, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.42959091923799647', '2020-03-17 16:05:03', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(27, 'DANIEL SANTIAGO', '23705566', 1, ' 0.4095956767516824', '2020-03-17 19:30:49', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(28, 'DANIEL SANTIAGO', '23705566', 1, ' 0.42190526354747876', '2020-03-17 19:31:07', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(29, 'SAINY CHAGAS', '22467607', 1, ' 0.42150635378917345', '2020-03-18 17:16:50', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(30, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.38301286421012526', '2020-03-19 11:44:45', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(31, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.4047552839077091', '2020-03-19 11:45:00', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(32, 'SAINY CHAGAS', '22467607', 1, ' 0.4139387879178823', '2020-03-19 12:08:05', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(33, 'AUGUSTO HENRIQUE CARNEIRO DE LIMA', '00437761', 1, ' 0.4161284115605097', '2020-03-19 15:00:49', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(34, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.4122369719721413', '2020-03-19 15:27:38', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(35, 'SAINY CHAGAS', '22467607', 1, ' 0.3799060852018728', '2020-03-20 11:55:50', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(36, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.4241047449792879', '2020-03-20 12:48:01', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(37, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.4189239728196156', '2020-03-23 15:12:19', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(38, 'GABRIEL ENES GARANTIZADO', '21012628', 1, ' 0.4248122445704107', '2020-03-23 16:20:16', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(39, 'EGERANIA GOUVEIA DE MATOS', '22505091', 1, ' 0.42977865242526764', '2020-03-24 12:16:21', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0'),
(40, 'AUGUSTO HENRIQUE CARNEIRO DE LIMA', '00437761', 1, ' 0.39036555163305287', '2020-06-23 12:59:09', ' rtsp://admin:admin@10.10.47.42:554/cam/realmonitor?channel=1&subtype=0');

-- --------------------------------------------------------

--
-- Estrutura para tabela `registro_localizacao`
--

CREATE TABLE `registro_localizacao` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `lat` varchar(30) NOT NULL,
  `lon` varchar(30) NOT NULL,
  `data` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `registro_pessoa`
--

CREATE TABLE `registro_pessoa` (
  `id_pessoa` int(11) NOT NULL,
  `cpf_pessoa` varchar(11) NOT NULL,
  `nome_pessoa` text NOT NULL,
  `data_nascimento` date NOT NULL,
  `fk_id_situacao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `registro_pessoa`
--

INSERT INTO `registro_pessoa` (`id_pessoa`, `cpf_pessoa`, `nome_pessoa`, `data_nascimento`, `fk_id_situacao`) VALUES
(1, '21012628', 'GABRIEL ENES GARANTIZADO', '1989-09-03', 1),
(2, '19979835', 'BRUNO COSTA DE OLIVEIRA', '1989-05-06', 1),
(3, '10642404', 'RENATO ANDRE DA COSTA MONTE', '1981-04-29', 1),
(4, '10556527', 'EDERSON DA CRUZ DOMINGOS', '1982-02-04', 1),
(5, '30323584', 'JACKSON DE AZEVEDO COSTA JUNIOR', '1999-08-05', 1),
(6, '15244687', 'RICK JONES', '1980-09-17', 1),
(7, '22467607', 'SAINY CHAGAS', '1993-01-23', 1),
(8, '23705566', 'DANIEL SANTIAGO', '1992-01-01', 1),
(9, '15986535', 'BRUNO HITOTUZI', '1982-12-24', 1),
(10, '27339122', 'DUIVILLY BRITO', '1996-07-12', 1),
(11, '00011505', 'GILMAR ALVES DE ALMEIDA', '1968-02-04', 1),
(12, '15992926', 'ALAN DE ANDRADE SAMPAIO', '1980-06-15', 1),
(13, '22998640', 'MARCIO GABRIEL CAPLAN DE ARAUJO', '1998-02-27', 1),
(14, '28999029', 'FELIPE AUGUSTO DE MENEZES', '1993-12-13', 1),
(15, '18372511', 'RODRIGO AUGUSTO PINTO MOURA', '1985-07-09', 1),
(16, '00003560', 'MARCOS NERES PEREIRA', '1978-08-05', 1),
(17, '00012851', 'SERGIO CARVALHO DA SILVA', '1971-10-27', 1),
(18, '22505091', 'EGERANIA GOUVEIA DE MATOS', '1988-08-12', 1),
(19, '27541169', 'JAIME LOPES DOS SANTOS', '1998-07-04', 1),
(20, '41978503', 'CLAUDIO RODRIGUES LIMA SOUSA', '1970-09-12', 1),
(21, '00020796', 'FERNANDO YUKIO MIYADAIRA', '1982-06-10', 1),
(22, '13460624', 'ROQUE GOMES PEREIRA', '1960-08-27', 1),
(23, '12908550', 'GIOVANNE FALABELLA SCOTTI', '1980-07-08', 1),
(24, '29709695', 'RENATO BASILIO DE CARVALHO', '1978-02-19', 1),
(25, '26604787', 'NICOLE MARQUES FEITOSA', '1997-02-03', 1),
(26, '19454465', 'FRANCISCO CARLOS RAMOS DE AZEVEDO ', '1989-03-12', 1),
(27, '29868769', 'JANAINA DE ABREU VASCONCELOS', '1997-09-01', 1),
(28, '11504048', 'FABRICIO PEREIRA DE MENEZES', '1976-02-05', 1),
(29, '22514775', 'CAMILO MOREIRA FERREIRA', '1990-11-08', 1),
(30, '05174873', 'FABIO MAJELA CUNHA GARCIA', '1968-10-02', 1),
(31, '07530846', 'MARLO RICARDO SOUZA DOS SANTOS', '1966-10-06', 1),
(32, '12816914', 'MARIA DE GUADALUPE DIAS DO NASCIMENTO', '1976-03-03', 1),
(33, '00018566', 'ERIVAN ALBUQUERQUE DE OLIVEIRA', '1979-12-08', 1),
(34, '00023739', 'GEISE GUIMARAES MILANEZ', '1981-12-09', 1),
(35, '11446196', 'JEAN ITALO COLARES DE ALMEIDA', '1977-07-01', 1),
(36, '81671656', ' RAFAEL DAGOSTINI SCHMIDT', '1981-03-10', 1),
(37, '06381448', 'CLEOGENES GUEDES GOMES', '1965-06-08', 1),
(38, '00437761', 'AUGUSTO HENRIQUE CARNEIRO DE LIMA', '1987-07-07', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `setor`
--

CREATE TABLE `setor` (
  `id` int(11) NOT NULL,
  `nome_setor` text NOT NULL,
  `localizacao` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `setor`
--

INSERT INTO `setor` (`id`, `nome_setor`, `localizacao`) VALUES
(1, 'SSP-DETEC', 'Interno'),
(2, 'SSP-GGI', 'Interno'),
(3, 'SSP-COMPRAS', 'Interno'),
(4, 'SSP-TRANSPORTE', 'Interno'),
(5, 'SSP-ESFRON', 'Interno'),
(6, 'SSP-RH', 'Interno'),
(7, 'SSP-SEAOP', 'Interno'),
(8, 'SSP-PROTOCOLO', 'Interno'),
(9, 'SSP-RECEPCAO', 'Interno'),
(10, 'SSP-PREVINE', 'Interno'),
(11, 'SSP-DA', 'Interno'),
(12, 'SSP-DOF', 'Interno'),
(13, 'SSP-DEPLAN', 'Interno'),
(14, 'SSP-GAGIS', 'Interno'),
(15, 'SSP-AJURIDICA', 'Interno'),
(16, 'SSP-EXECUTIVO', 'Interno'),
(17, 'SSP-CHEFIA DE GABINETE', 'Interno'),
(18, 'SSP-SECRETARIO', 'Interno'),
(19, 'SSP-ALMOXARIFADO', 'Interno'),
(20, 'SSP-IDENTIFICACAO', 'Interno'),
(21, 'SSP-DPTC', 'Interno'),
(22, 'SSP-REPROGRAGIA', 'Interno'),
(23, 'SSP-IMPRENSA', 'Interno'),
(24, 'SSP-CPPA', 'Interno'),
(25, 'SSP-GERENCIA DE CONTRATOS', 'Interno'),
(26, 'SSP-SEGURANCA INSTITUCIONAL', 'Interno'),
(27, 'SSP-ARQUIVO', 'Interno'),
(28, 'SSP-CCI', 'Interno'),
(29, 'SSP-RADIO', 'Interno'),
(30, 'SSP-CONTROLE INTERNO', 'Interno');

-- --------------------------------------------------------

--
-- Estrutura para tabela `situacao`
--

CREATE TABLE `situacao` (
  `id` int(11) NOT NULL,
  `nome_situacao` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `situacao`
--

INSERT INTO `situacao` (`id`, `nome_situacao`) VALUES
(1, 'PERMITIDO'),
(2, 'BLOQUEADO');

-- --------------------------------------------------------

--
-- Estrutura para tabela `unidade`
--

CREATE TABLE `unidade` (
  `id_unidade` int(11) NOT NULL,
  `nome_unidade` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `unidade`
--

INSERT INTO `unidade` (`id_unidade`, `nome_unidade`) VALUES
(1, 'SSP-AM');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nome_usuario` text NOT NULL,
  `cpf_usuario` varchar(11) NOT NULL,
  `matricula` text NOT NULL,
  `contato` varchar(11) NOT NULL,
  `fk_id_unidade` int(11) NOT NULL,
  `email` text NOT NULL,
  `senha` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome_usuario`, `cpf_usuario`, `matricula`, `contato`, `fk_id_unidade`, `email`, `senha`) VALUES
(1, 'DUIVILLY BRITO', '02166126243', '2471140B', '92984451748', 1, 'duivilly@gmail.com', 'dcddb75469b4b4875094e14561e573d8'),
(2, 'ADMIN', '02166126243', '9999999A', '99999999999', 1, 'admin@admin', '827ccb0eea8a706c4c34a16891f84e7b');

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `anexo`
--
ALTER TABLE `anexo`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `camera`
--
ALTER TABLE `camera`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `historico_registro`
--
ALTER TABLE `historico_registro`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `livro_ocorrencia`
--
ALTER TABLE `livro_ocorrencia`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `log_monitoramento`
--
ALTER TABLE `log_monitoramento`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `registro_localizacao`
--
ALTER TABLE `registro_localizacao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `registro_pessoa`
--
ALTER TABLE `registro_pessoa`
  ADD PRIMARY KEY (`id_pessoa`),
  ADD KEY `fk_id_situacao` (`fk_id_situacao`);

--
-- Índices de tabela `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Índices de tabela `setor`
--
ALTER TABLE `setor`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `situacao`
--
ALTER TABLE `situacao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `unidade`
--
ALTER TABLE `unidade`
  ADD PRIMARY KEY (`id_unidade`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `fk_id_unidade` (`fk_id_unidade`);

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `anexo`
--
ALTER TABLE `anexo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de tabela `camera`
--
ALTER TABLE `camera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `historico_registro`
--
ALTER TABLE `historico_registro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de tabela `livro_ocorrencia`
--
ALTER TABLE `livro_ocorrencia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `log_monitoramento`
--
ALTER TABLE `log_monitoramento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de tabela `registro_localizacao`
--
ALTER TABLE `registro_localizacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `registro_pessoa`
--
ALTER TABLE `registro_pessoa`
  MODIFY `id_pessoa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de tabela `setor`
--
ALTER TABLE `setor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de tabela `situacao`
--
ALTER TABLE `situacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `unidade`
--
ALTER TABLE `unidade`
  MODIFY `id_unidade` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `registro_pessoa`
--
ALTER TABLE `registro_pessoa`
  ADD CONSTRAINT `registro_pessoa_ibfk_1` FOREIGN KEY (`fk_id_situacao`) REFERENCES `situacao` (`id`);

--
-- Restrições para tabelas `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`fk_id_unidade`) REFERENCES `unidade` (`id_unidade`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

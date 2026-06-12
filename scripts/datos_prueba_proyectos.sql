--
-- PostgreSQL database dump
--

\restrict Gd8uc4hhRBdcznZeMJDoJHrdVH9Jhr9fi3OFmJ3X1j0swGrcIl98r2JYyJLX2fU

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-05-28 20:28:46

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4974 (class 0 OID 16565)
-- Dependencies: 227
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clientes VALUES (1, 'Tamara', 'Activo');
INSERT INTO public.clientes VALUES (2, 'Anabella', 'Activo');
INSERT INTO public.clientes VALUES (3, 'Julio', 'Activo');
INSERT INTO public.clientes VALUES (4, 'Lautaro', 'Activo');
INSERT INTO public.clientes VALUES (5, 'Emiliano', 'Activo');


--
-- TOC entry 4972 (class 0 OID 16552)
-- Dependencies: 225
-- Data for Name: proyectos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.proyectos VALUES (1, 'Tpfinal', 'Activo', 1);
INSERT INTO public.proyectos VALUES (2, 'Tpfinal 2', 'Activo', 2);
INSERT INTO public.proyectos VALUES (3, 'Tpfinal3', 'Activo', 3);
INSERT INTO public.proyectos VALUES (4, 'Tpfinal4', 'Activo', 4);
INSERT INTO public.proyectos VALUES (5, 'Tpfinal5', 'Activo', 5);


--
-- TOC entry 4970 (class 0 OID 16539)
-- Dependencies: 223
-- Data for Name: tareas; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4968 (class 0 OID 16523)
-- Dependencies: 221
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios VALUES (1, 'admin', 'admin', 'Activo', 'ADMIN');


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 226
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_seq', 5, true);


--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 224
-- Name: proyectos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proyectos_id_seq', 5, true);


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 222
-- Name: tareas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tareas_id_seq', 1, false);


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 220
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 7, true);


-- Completed on 2026-05-28 20:28:47

--
-- PostgreSQL database dump complete
--

\unrestrict Gd8uc4hhRBdcznZeMJDoJHrdVH9Jhr9fi3OFmJ3X1j0swGrcIl98r2JYyJLX2fU


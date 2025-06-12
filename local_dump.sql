--
-- PostgreSQL database dump
--

-- Dumped from database version 15.10 (Postgres.app)
-- Dumped by pg_dump version 15.10 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: zawwunna
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    text text NOT NULL,
    "heroId" integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.comments OWNER TO zawwunna;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: zawwunna
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO zawwunna;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zawwunna
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: zawwunna
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.users OWNER TO zawwunna;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: zawwunna
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO zawwunna;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zawwunna
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: zawwunna
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: zawwunna
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: zawwunna
--

COPY public.comments (id, text, "heroId", "timestamp", user_id) FROM stdin;
1	OP	1017100	2025-01-28 07:03:27.649989	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: zawwunna
--

COPY public.users (id, email, username, password) FROM stdin;
1	user1@gmail.com	user1	$2b$12$mYmDQPWetLOGrEDsm3Fx8.nIi8E3ftSoFqUhz9H3SJiLsico5v18W
\.


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zawwunna
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zawwunna
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: zawwunna
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: zawwunna
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: zawwunna
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: zawwunna
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zawwunna
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


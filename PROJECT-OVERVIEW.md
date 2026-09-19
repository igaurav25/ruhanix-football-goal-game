# Ruhanix Football Goal Game — Project Overview

## Problem / Product

Ruhanix is a football goal-shooting game centered around short skill-based matches. The player logs in, enters the lobby, starts a match, takes a limited number of shots, receives a result, earns progression rewards, and can access leaderboard/shop functionality.

## Frontend Responsibility

The React Native app contains the user-facing application flow:

`Login → Lobby → Match → Result → Shop`

The main gameplay screen (`frontend/app/match.tsx`) manages match state, swipe gesture input, target-zone detection, shot calculations, goalkeeper movement, animations and result handling.

## Backend Responsibility

The PHP backend exposes endpoints for account, player, game and leaderboard data. The score-submission endpoint persists the result and performs related XP/level/leaderboard updates inside a database transaction.

## Database Responsibility

The PHP layer uses PDO and SQL queries to read/write user, match, result, leaderboard and shop-related records.

## Main Technical Challenge

The gameplay implementation combines gesture input with animation and probabilistic gameplay logic. A player's swipe is converted into a target direction/zone, then power/accuracy/curve and goalkeeper behavior are used to determine the outcome.

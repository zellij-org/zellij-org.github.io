#!/bin/bash

{ mdbook watch docs/ -d ../static/documentation & hugo server; }
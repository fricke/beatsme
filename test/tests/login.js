var should = require('should');
var app = require('../../server');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var request = require('supertest');

var user;

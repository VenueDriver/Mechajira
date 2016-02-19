require 'rubygems'
require 'yaml'
require 'jira'
require 'byebug'
require 'pp'

$LOAD_PATH.unshift('lib')
require 'deepopenstruct'

jira_config = DeepOpenStruct.load YAML.load_file('config/jira.yml')

options =
  {
    :site     => jira_config.url,
    :username => jira_config.username,
    :password => jira_config.password,
    :context_path => '',
    :auth_type => :basic,
    :use_ssl => true
  }

client = JIRA::Client.new(options)

client.Issue.jql("comment ~ #{jira_config.username}", fields: [:comments, :summary]).each do |issue|
   puts "#{issue.id} - #{issue.fields['summary']}"
   byebug
   puts '.'
 end

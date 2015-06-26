require 'sinatra'
require 'haml'
require 'data_mapper'

module Fascade
DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/development.db")

  class App < Sinatra::Base

    class Task
      include DataMapper::Resource
    
      property :id,           Serial
      property :name,         Text
      property :completed_at, DateTime
    
      def completed?
        true if completed_at
      end
    
      def self.completed
        all(:completed_at.not => nil)
      end
    
      def link
        "<a href=\"task/#{self.id}\">delete</a>"   
      end
    
    
    end
  
    # list all tasks
    get '/' do
      @tasks = Task.all
      haml :index
    end
    
    # create new task   
    post '/task/create' do
      task = Task.new(:name => params[:name])
      if task.save
        status 201
        redirect '/'  
      else
        status 412
        redirect '/'   
      end
    end
    
    # edit task
    get '/task/:id' do
      @task = Task.get(params[:id])
      haml :edit
    end
    
    # update task
    post '/task/:id' do
      task = Task.get(params[:id])
      task.completed_at = params[:completed] ?  Time.now : nil
      task.name = (params[:name])
      if task.save
        status 201
        redirect '/'
      else
        status 412
        redirect '/'   
      end
    end

    # view drill
    get '/task/:id/view' do
      @task = Task.get(params[:id])
      haml :view
    end

    # delete confirmation
    get '/task/:id/delete' do
      @task = Task.get(params[:id])
      haml :confirm_delete
    end
    
    # delete task
    post '/task/:id/delete' do
      Task.get(params[:id]).destroy
      redirect '/'  
    end
    
    get '/about' do
      haml :about
    end
    
    DataMapper.auto_upgrade!
  
  end
end
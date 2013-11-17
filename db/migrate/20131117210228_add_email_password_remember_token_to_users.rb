class AddEmailPasswordRememberTokenToUsers < ActiveRecord::Migration
  def change
    add_column :users, :email, :string
    add_column :users, :password, :string
    add_column :users, :remember_token, :string
  end
end

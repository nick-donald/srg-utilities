class AddFilePathToQuery < ActiveRecord::Migration
  def change
    add_column :queries, :filepath, :string
  end
end

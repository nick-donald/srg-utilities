class CreateQueryResults < ActiveRecord::Migration
  def change
    create_table :query_results do |t|
      t.integer :query_id
      t.string :name
      t.string :address
      t.string :phone
      t.string :data
      
      t.timestamps
    end
  end
end

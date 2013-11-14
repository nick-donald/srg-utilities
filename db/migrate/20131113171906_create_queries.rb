class CreateQueries < ActiveRecord::Migration
  def change
    create_table :queries do |t|
      t.string :query
      t.string :center
      t.string :radius

      t.timestamps
    end
  end
end

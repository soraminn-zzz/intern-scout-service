class CreateFavoriteInterns < ActiveRecord::Migration[8.1]
  def change
    create_table :favorite_interns do |t|
      t.references :company, null: false, foreign_key: { to_table: :users }
      t.references :intern, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :favorite_interns, %i[company_id intern_id], unique: true
  end
end
